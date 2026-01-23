import { Playwright } from './Playwright';
import { Logger } from './Logger';
import { BrowserWindow, app } from 'electron';
import pLimit from 'p-limit';

const MAX_CONCURRENT_BROWSERS = parseInt(process.env.CONCURRENCY_LIMIT || '20', 10);
const limit = pLimit(MAX_CONCURRENT_BROWSERS);

// Use same URL as main process
const API_URL = process.env.API_URL || (app.isPackaged ? 'http://91.98.128.189:3001' : 'http://91.98.128.189:3001');

// In-memory cache of next execution times to prevent spamming API
// Map<AccountId, Timestamp>
const executionTimestamps = new Map<string, number>();

export const onSchedule = {
    intervalId: null as NodeJS.Timeout | null,
    win: null as BrowserWindow | null,
    userUuid: null as string | null,
    isRunning: false,
    activeTasks: 0,

    setWindow: (win: BrowserWindow) => {
        onSchedule.win = win;
    },

    init: (uuid: string, mode: string) => {
        if (!uuid) return;
        onSchedule.userUuid = uuid;

        if (onSchedule.intervalId) return;

        Logger.info('Scheduler', `Starting Scheduler for user ${uuid} (Mode: ${mode})`);

        // Loop every 5 seconds
        onSchedule.intervalId = setInterval(() => {
            onSchedule.runSchedule();
        }, 5000);

        // Immediate run
        onSchedule.runSchedule();
    },

    stop: (uuid: string) => {
        // If specific uuid, checks? For now just stop if match
        if (onSchedule.userUuid === uuid) {
            onSchedule.stopAll();
        }
    },

    stopAll: () => {
        if (onSchedule.intervalId) {
            clearInterval(onSchedule.intervalId);
            onSchedule.intervalId = null;
            Logger.info('Scheduler', 'Scheduler stopped.');
        }
    },

    runSchedule: async () => {
        if (onSchedule.isRunning) return;
        if (!onSchedule.userUuid) return;

        onSchedule.isRunning = true;
        try {
            // Fetch Accounts
            const response = await fetch(`${API_URL}/api/accounts?userUuid=${onSchedule.userUuid}`);
            if (!response.ok) throw new Error('Failed to fetch accounts');

            const accounts = await response.json();
            const now = Date.now();

            const dueAccounts = accounts.filter((acc: any) => {
                if (acc.status !== 'Ativo' || !acc.enabled || acc.hasCaptcha) return false;

                // Check local execution timestamp
                const nextExec = executionTimestamps.get(acc._id) || 0;

                // Also check server-side 'nextExecution' if synced? 
                // For now, trust local if available, or assume '0' means ready if not set.
                // The API accounts list might return 'nextExecution'.
                const serverNext = acc.nextExecution || 0;

                // Allow if EITHER local or server say it's time (and local hasn't pushed it out further)
                // Actually, let's just use local cache primarily to debounce.
                return now >= nextExec && now >= serverNext;
            });

            if (dueAccounts.length > 0) {
                Logger.info('Scheduler', `Found ${dueAccounts.length} accounts due for execution.`);

                // Queue them
                Promise.all(dueAccounts.map((acc: any) => {
                    return limit(async () => {
                        onSchedule.activeTasks++;
                        try {
                            await onSchedule.processAccount(acc);
                        } finally {
                            onSchedule.activeTasks--;
                        }
                    });
                }));
            }

        } catch (error: any) {
            Logger.error('Scheduler', `Cycle error: ${error.message}`);
        } finally {
            onSchedule.isRunning = false;
        }
    },

    processAccount: async (account: any) => {
        try {
            // Update next execution immediately to prevent double scheduling
            // Min 3 min, Max 6 min delay
            const min = 3 * 60 * 1000;
            const max = 6 * 60 * 1000;
            const nextDelay = Math.floor(Math.random() * (max - min + 1) + min);
            const nextTime = Date.now() + nextDelay;
            executionTimestamps.set(account._id, nextTime);

            Logger.header(`Processing: ${account.name} (World: ${account.world})`);

            // Fetch latest user settings (for global strategies)
            const userResponse = await fetch(`${API_URL}/api/users/${onSchedule.userUuid}`);
            const user = await userResponse.json();
            const globalSettings = user.globalSettings || {};

            // Construct Options
            let proxyOptions: any = null;
            if (account.proxy && account.proxy !== 'Sem Proxy') {
                const parts = account.proxy.split(':');
                if (parts.length >= 2) {
                    proxyOptions = {
                        proxy_address: parts[0],
                        port: parts[1],
                        username: parts[2] || '',
                        password: parts[3] || ''
                    };
                }
            }

            const options = {
                config: {
                    name: account.name,
                    password: account.password,
                    server: { domain: account.server },
                    world: { domain: account.world },
                    proxy: proxyOptions,
                    cookies: account.cookies || [],
                    config: account.config, // Raw config from account
                    globalSettings: globalSettings,
                    accountId: account._id,
                    discordWebhook: account.discordWebhook || user.preferences?.discordWebhook || globalSettings.discordWebhook,
                    lastCaptchaNotification: account.lastCaptchaNotification || 0
                },
                browser: {
                    windowSize: '1280,720',
                    closeSession: true,
                    closeCaptcha: false,
                    browser: user.preferences?.browser || 'chrome'
                }
            };

            const playwright = new Playwright(options);
            const result: any = await playwright.start();

            // Handle Result & Update API
            const updates: any = {};
            updates.lastExecution = Date.now();
            updates.nextExecution = nextTime; // Push to server too

            if (!result) {
                Logger.error('Scheduler', `Account ${account.name} returned null.`);
            } else if (result.error) {
                Logger.error('Scheduler', `Account ${account.name} error: ${result.error}`);
            } else if (result.status === 'CAPTCHA') {
                updates.status = 'Captcha';
                updates.hasCaptcha = true;
                Logger.warn('Scheduler', `Account ${account.name} hit CAPTCHA.`);
            } else if (result.status === 'SESSION_EXPIRED') {
                updates.status = 'Desconectado';
                Logger.warn('Scheduler', `Account ${account.name} session expired.`);
            } else if (result.cookies) {
                Logger.success('Scheduler', `Account ${account.name} execution success.`);
                updates.status = 'Ativo';
                updates.cookies = result.cookies;

                if (result.data) {
                    const data = result.data as any;
                    if (data.units) updates.units = data.units;
                    if (data.resources) updates.resources = data.resources;
                    if (data.farm) updates.farm = data.farm;
                    if (data.incoming !== undefined) updates.incoming = data.incoming;
                    if (data.points !== undefined) updates.points = data.points;
                    if (data.premiumPoints !== undefined) updates.premiumPoints = data.premiumPoints;
                    if (data.hasCaptcha !== undefined) updates.hasCaptcha = data.hasCaptcha;
                    if (data.lastCaptchaNotification) {
                        updates.lastCaptchaNotification = data.lastCaptchaNotification;
                    }
                }
            }

            // Sync to API
            await fetch(`${API_URL}/api/accounts/${account._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

        } catch (error: any) {
            Logger.error('Scheduler', `Process error for ${account.name}: ${error.message}`);
        }
    }
};
