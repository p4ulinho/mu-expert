import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as dotenv from 'dotenv'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import { onSchedule } from './automation/Scheduler'
import { getServers, processAccountsFile } from './automation/Utils'
import { Playwright } from './automation/Playwright'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

process.env.DIST_ELECTRON = path.join(__dirname, '..')
process.env.DIST = path.join(process.env.DIST_ELECTRON, 'dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST_ELECTRON, 'public')

const API_URL = process.env.API_URL || (app.isPackaged ? 'http://91.98.128.189:3001' : 'http://91.98.128.189:3001')
console.log('API URL initialized as:', API_URL)

let win: BrowserWindow | null

function createWindow() {
    win = new BrowserWindow({
        icon: path.join(process.env.VITE_PUBLIC as string, 'electron-vite.svg'),
        width: 1200,
        height: 800,
        minWidth: 1000,
        minHeight: 700,
        frame: false,
        titleBarStyle: 'hidden',
        backgroundColor: '#0a0a0c',
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            devTools: false,
        },
    })

    // Disable opening DevTools
    win.webContents.on('devtools-opened', () => {
        win?.webContents.closeDevTools();
    });

    onSchedule.setWindow(win)

    if (process.env.VITE_DEV_SERVER_URL) {
        console.log('Loading from Vite Dev Server:', process.env.VITE_DEV_SERVER_URL)
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        const indexPath = path.join(process.env.DIST as string, 'index.html')
        console.log('Loading from file:', indexPath)
        win.loadFile(indexPath)
    }
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        win = null
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// IPC Handlers
ipcMain.on('window-controls', (event, action) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) return

    if (action === 'minimize') win.minimize()
    if (action === 'maximize') {
        if (win.isMaximized()) win.unmaximize()
        else win.maximize()
    }
    if (action === 'close') win.close()
})

// Helper for API requests
// Helper for API requests with Retry and Timeout
async function request(url: string, options: RequestInit = {}, retries = 1, timeout = 15000) {
    for (let i = 0; i < retries; i++) {
        try {
            // Create a controller for the timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok && response.status !== 400 && response.status !== 404) {
                throw new Error(`HTTP error! status: ${response.status} `);
            }
            return await response.json();
        } catch (error: any) {
            const isLastAttempt = i === retries - 1;
            console.error(`Request failed for ${url}(Attempt ${i + 1}/${retries}): `, error.message);

            if (isLastAttempt) {
                return { success: false, error: error.message };
            }

            // Wait before retrying (exponential backoff: 1s, 2s, 4s)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
    }
}

// Auth Handlers
ipcMain.handle('auth:register', async (_, data) => await request(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
}))

ipcMain.handle('auth:login', async (_, credentials) => await request(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
}))

ipcMain.handle('user:get', async (_, uuid) => await request(`${API_URL}/api/users/${uuid}`))

// User preferences/profile
ipcMain.handle('user:update-profile', async (_, data) => await request(`${API_URL}/api/users/${data.uuid}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
}))

ipcMain.handle('user:update-settings', async (_, payload) => {
    return await request(`${API_URL}/api/users/${payload.userUuid}/settings`, {
        method: 'POST', // or PUT depending on your API
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload.settings })
    })
})

ipcMain.handle('user:update-preferences', async (_, arg1, arg2) => {
    let uuid: string;
    let payload: any;

    if (typeof arg1 === 'string') {
        uuid = arg1;
        payload = arg2;
    } else {
        uuid = arg1.uuid;
        payload = arg1; // Send full object, controller handles it
    }

    const result = await request(`${API_URL}/api/users/${uuid}/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return result;
})

// Account Handlers
ipcMain.handle('accounts:get', async (_, userUuid) => {
    const data = await request(`${API_URL}/api/accounts?userUuid=${userUuid}`)
    return Array.isArray(data) ? data : []
})

ipcMain.handle('accounts:add', async (_, data) => await request(`${API_URL}/api/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
}))

ipcMain.handle('accounts:get-all', async (_, userUuid) => {
    const data = await request(`${API_URL}/api/accounts?userUuid=${userUuid}`)
    return { success: true, accounts: Array.isArray(data) ? data : [] }
})

ipcMain.handle('accounts:bulk-add', async (_, data) => await request(`${API_URL}/api/accounts/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
}))

ipcMain.handle('accounts:bulk-update', async (_, userUuid, { accountIds, updateData }) => {
    // Simple implementation: sequential updates or backend bulk endpoint if available
    // Assuming backend has /api/accounts/bulk-update
    return await request(`${API_URL}/api/accounts/bulk-update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountIds, updateData })
    })
})

ipcMain.handle('accounts:bulk-update-group', async (_, userUuid, { targetGroup, newGroup }) => {
    return await request(`${API_URL}/api/accounts/bulk-update-group`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userUuid, targetGroup, newGroup })
    })
})

ipcMain.handle('accounts:delete', async (_, id) => await request(`${API_URL}/api/accounts/${id}`, { method: 'DELETE' }))

ipcMain.handle('accounts:update', async (_, data) => await request(`${API_URL}/api/accounts/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
}))

ipcMain.handle('accounts:update-strategy', async (_, payload) => await request(`${API_URL}/api/accounts/strategy`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
}))

ipcMain.handle('accounts:login', async (_, arg) => {
    try {
        const id = typeof arg === 'string' ? arg : arg.id
        const autoClose = typeof arg === 'object' ? !!arg.autoClose : false

        const account = await request(`${API_URL}/api/accounts/${id}`)
        if (!account || !account._id) return { success: false, error: 'Conta não encontrada' }

        let proxyOptions: any = null
        if (account.proxy && account.proxy.toLowerCase() !== 'sem proxy') {
            const cleanProxy = account.proxy.trim();
            const parts = cleanProxy.split(':').map((p: string) => p.trim());

            if (parts.length >= 2) {
                // Strip protocol if user pasted it
                let address = parts[0].replace(/^https?:\/\//i, '');

                proxyOptions = {
                    proxy_address: address,
                    port: parts[1],
                    username: parts[2] || undefined,
                    password: parts[3] || undefined
                }
            }
        }



        // Fetch User for global settings
        let globalSettings: any = {};
        let userPreferences: any = {};
        try {
            const userResponse = await request(`${API_URL}/api/users/${account.user || account.userUuid}`);
            if (userResponse && userResponse.globalSettings) {
                globalSettings = userResponse.globalSettings;
                userPreferences = userResponse.preferences || {};
            }
        } catch (err) {
            console.error('Failed to fetch user settings for automation:', err);
        }

        const options = {
            config: {
                name: account.name,
                password: account.password,
                server: { domain: account.server },
                world: { domain: account.world },
                proxy: proxyOptions,
                cookies: account.cookies || [],
                userUuid: account.user || account.userUuid,
                accountId: account._id,
                apiUrl: API_URL,
                globalSettings: globalSettings,
                discordWebhook: account.discordWebhook || userPreferences.discordWebhook || globalSettings.discordWebhook,
                lastCaptchaNotification: account.lastCaptchaNotification || 0
            },
            browser: {
                closeSession: autoClose,
                closeCaptcha: false,
            },
            onStatusUpdate: (msg: string) => {
                // Send status to frontend
                if (win && !win.isDestroyed()) {
                    win.webContents.send('automation-status', { accountId: id, message: msg });
                }
            },
            onDebugData: (type: string, data: any) => {
                if (win && !win.isDestroyed()) {
                    win.webContents.send('automation-debug', { accountId: id, type, data });
                }
            },
            onCaptchaUpdate: async (hasCaptcha: boolean) => {
                console.log(`[Main] Captcha status update for ${id}: ${hasCaptcha}`);
                try {
                    await request(`${API_URL}/api/accounts/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ hasCaptcha })
                    });
                } catch (error: any) {
                    console.error(`[Main] Failed to update captcha status for ${id}:`, error.message);
                }
            }
        }

        const playwright = new Playwright(options)
        const result = await playwright.start()

        if (result && result.cookies) {
            const hasSid = result.cookies.some((c: any) => c.name?.toLowerCase() === 'sid');
            const hasAuth = result.cookies.some((c: any) => c.name?.toLowerCase().includes('auth'));

            const updates: any = {
                id: account._id,
                cookies: result.cookies,
                status: (hasSid || hasAuth) ? 'Ativo' : 'Offline'
            }

            if (result.data) {
                const data = result.data as any;
                if (data.units) updates.units = data.units
                updates.resources = data.resources
                updates.farm = data.farm
                updates.incoming = data.incoming || 0
                updates.points = data.points || 0
                updates.premiumPoints = data.premiumPoints || 0
                updates.hasCaptcha = data.hasCaptcha || false
            }

            const updateResult = await request(`${API_URL}/api/accounts/${account._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            })

            if (updateResult.success === false) {
                return { success: false, error: `Falha ao salvar dados: ${updateResult.error}` }
            }

            if (!hasSid && !hasAuth) {
                console.log('Session missing. Available cookies:', result.cookies.map((c: any) => c.name));
                return { success: false, error: 'Sessão não encontrada' }
            }

            return { success: true, cookies: result.cookies, account: { ...account, ...updates } }
        } else {
            return { success: false, error: 'Falha ao realizar login ou capturar cookies' }
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
})

// Proxy Handlers
ipcMain.handle('proxies:get', async (_, userUuid) => {
    const data = await request(`${API_URL}/api/proxies?userUuid=${userUuid}`)
    return Array.isArray(data) ? data : []
})

ipcMain.handle('proxies:add', async (_, data) => await request(`${API_URL}/api/proxies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
}))

ipcMain.handle('proxies:delete', async (_, id) => await request(`${API_URL}/api/proxies/${id}`, { method: 'DELETE' }))

ipcMain.handle('proxies:delete-all', async (_, userUuid) => {
    const url = `${API_URL}/api/proxy/bulk-delete?userUuid=${userUuid}`
    console.log('Fetching bulk delete URL:', url)
    return await request(url, { method: 'DELETE' })
})

ipcMain.handle('proxies:auto-assign', async (_, { userUuid, allowReuse }) => {
    try {
        // 1. Fetch Accounts and Proxies
        const [accounts, proxies] = await Promise.all([
            request(`${API_URL}/api/accounts?userUuid=${userUuid}`),
            request(`${API_URL}/api/proxies?userUuid=${userUuid}`)
        ])

        if (!Array.isArray(accounts) || !Array.isArray(proxies)) {
            return { success: false, error: 'Falha ao buscar dados.' }
        }

        // 2. Build Usage Map: IP -> Set<WorldPrefix>
        const proxyUsageMap = new Map<string, Set<string>>();

        accounts.forEach((acc: any) => {
            if (acc.proxy && typeof acc.proxy === 'string' && !acc.proxy.toLowerCase().includes('sem proxy')) {
                const ip = acc.proxy.split(':')[0].trim();
                if (!proxyUsageMap.has(ip)) {
                    proxyUsageMap.set(ip, new Set());
                }
                const world = acc.worldPrefix ? acc.worldPrefix.toLowerCase() : 'unknown';
                proxyUsageMap.get(ip)!.add(world);
            }
        });

        // 3. Identify accounts without proxy
        const accountsWithoutProxy = accounts.filter((acc: any) =>
            !acc.proxy ||
            acc.proxy.trim() === '' ||
            /sem\s*proxy/i.test(acc.proxy)
        )

        if (accountsWithoutProxy.length === 0) {
            return { success: true, count: 0, message: 'Todas as contas já possuem proxy configurado.' }
        }

        // 4. Assign Proxies
        let assignedCount = 0;
        const updates = [];

        // Helper to find best proxy for an account
        const findBestProxy = (targetWorld: string) => {
            // Priority 1: Completely unused proxies
            const completelyUnused = proxies.find((p: any) => {
                const ip = p.address.split(':')[0].trim();
                return !proxyUsageMap.has(ip);
            });
            if (completelyUnused) return completelyUnused;

            // Priority 2: Used proxies but NOT on this world (ONLY IF allowReuse is true)
            if (allowReuse) {
                const tWorld = targetWorld ? targetWorld.toLowerCase() : 'unknown';

                const reusingCandidate = proxies.find((p: any) => {
                    const ip = p.address.split(':')[0].trim();
                    const usedWorlds = proxyUsageMap.get(ip);
                    // valid if usedWorlds exists AND doesn't contain tWorld
                    return usedWorlds && !usedWorlds.has(tWorld);
                });

                return reusingCandidate;
            }

            return null;
        }

        for (const account of accountsWithoutProxy) {
            const targetWorld = account.worldPrefix || '';
            const bestProxy = findBestProxy(targetWorld);

            if (!bestProxy) {
                continue;
            }

            const ip = bestProxy.address.split(':')[0].trim();

            // Mark as used for this world immediately
            if (!proxyUsageMap.has(ip)) {
                proxyUsageMap.set(ip, new Set());
            }
            proxyUsageMap.get(ip)!.add(targetWorld ? targetWorld.toLowerCase() : 'unknown');

            // Construct Proxy String
            let proxyString = bestProxy.address.trim();
            const colons = (proxyString.match(/:/g) || []).length;

            if (colons < 2) {
                proxyString = `${bestProxy.address}:${bestProxy.port || ''}:${bestProxy.username || ''}:${bestProxy.password || ''}`
            }

            updates.push(request(`${API_URL}/api/accounts/${account._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ proxy: proxyString })
            }));

            assignedCount++;
        }

        await Promise.all(updates);

        if (assignedCount === 0 && accountsWithoutProxy.length > 0) {
            return {
                success: true, count: 0, message: allowReuse
                    ? 'Não há proxies compatíveis disponíveis (todos em uso no mesmo mundo).'
                    : 'Não há proxies livres disponíveis. Tente habilitar a reutilização.'
            }
        }

        return { success: true, count: assignedCount }

    } catch (error: any) {
        return { success: false, error: error.message }
    }
})

// Strategy Models Handlers
ipcMain.handle('construction:get-models', async (_, userUuid) => await request(`${API_URL}/api/users/${userUuid}/construction/models`))

ipcMain.handle('construction:save-model', async (_, { userUuid, model }) => await request(`${API_URL}/api/users/${userUuid}/construction/models`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model })
}))

ipcMain.handle('construction:delete-model', async (_, { userUuid, modelUuid }) => await request(`${API_URL}/api/users/${userUuid}/construction/models/${modelUuid}`, {
    method: 'DELETE'
}))

ipcMain.handle('construction:get-settings', async (_, userUuid) => await request(`${API_URL}/api/users/${userUuid}/settings`))

ipcMain.handle('construction:save-settings', async (_, { userUuid, settings }) => await request(`${API_URL}/api/users/${userUuid}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ settings })
}))

ipcMain.handle('recruitment:get-models', async (_, userUuid) => await request(`${API_URL}/api/users/${userUuid}/recruitment/models`))

ipcMain.handle('recruitment:save-model', async (_, { userUuid, model }) => await request(`${API_URL}/api/users/${userUuid}/recruitment/models`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model })
}))

ipcMain.handle('recruitment:delete-model', async (_, { userUuid, modelUuid }) => await request(`${API_URL}/api/users/${userUuid}/recruitment/models/${modelUuid}`, {
    method: 'DELETE'
}))

ipcMain.handle('recruitment:get-settings', async (_, userUuid) => await request(`${API_URL}/api/users/${userUuid}/settings`))

ipcMain.handle('recruitment:save-settings', async (_, { userUuid, settings }) => await request(`${API_URL}/api/users/${userUuid}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ settings })
}))

ipcMain.handle('scavenge:save-settings', async (_, { userUuid, settings }) => await request(`${API_URL}/api/users/${userUuid}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ settings })
}))

ipcMain.handle('premiumExchange:save-settings', async (_, { userUuid, settings }) => await request(`${API_URL}/api/users/${userUuid}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ settings })
}))

// Billing Handlers
ipcMain.handle('billing:validate-coupon', async (_, data) => await request(`${API_URL}/billing/validate-coupon`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
}))

ipcMain.handle('billing:purchase', async (_, data) => await request(`${API_URL}/billing/purchase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
}))

// Proxy Stock
ipcMain.handle('proxies:get-stock', async () => await request(`${API_URL}/api/proxies/stock`))
ipcMain.handle('proxies:import-stock', async (_, data) => await request(`${API_URL}/api/proxies/stock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
}))

// Mercado Pago Payment
ipcMain.handle('payments:create', async (_, data) => {
    try {
        const response = await request(`${API_URL}/billing/preference`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.init_point) {
            shell.openExternal(response.init_point);
            return { success: true, url: response.init_point };
        } else {
            return { success: false, error: 'Falha ao obter URL de pagamento.' };
        }
    } catch (error: any) {
        return { success: false, error: error.message };
    }
})

// Automation Handlers
ipcMain.handle('automation:get-servers', async (_, domains) => {
    return await getServers(domains);
});

ipcMain.handle('automation:process-file', async (_, file) => {
    return processAccountsFile(file);
});

ipcMain.handle('automation:start-playwright', async (_, options) => {
    try {
        return await Playwright.init(options);
    } catch (error: any) {
        return { success: false, error: error.message };
    }
});

ipcMain.on('scheduler:init', (_, { uuid, mode }) => {
    onSchedule.init(uuid, mode);
});

ipcMain.on('scheduler:stop', (_, uuid) => {
    onSchedule.stop(uuid);
});

ipcMain.on('scheduler:stop-all', () => {
    onSchedule.stopAll();
});

// Auto Updater
// Auto Updater
function setupAutoUpdater() {
    log.transports.file.level = 'info'
    autoUpdater.logger = log
    autoUpdater.autoDownload = false // Disable auto download to let user decide
    autoUpdater.autoInstallOnAppQuit = false

    log.info('App starting...')

    // Forward events to renderer
    const sendStatusToWindow = (text: string, data: any = null) => {
        log.info(text);
        if (win && !win.isDestroyed()) {
            win.webContents.send('updater:status', { text, data });
        }
    }

    autoUpdater.on('checking-for-update', () => {
        sendStatusToWindow('Checking for update...');
        if (win && !win.isDestroyed()) win.webContents.send('updater:event', { type: 'checking' });
    })

    autoUpdater.on('update-available', (info) => {
        sendStatusToWindow('Update available.', info);
        if (win && !win.isDestroyed()) win.webContents.send('updater:event', { type: 'available', info });
    })

    autoUpdater.on('update-not-available', (info) => {
        sendStatusToWindow('Update not available.', info);
        if (win && !win.isDestroyed()) win.webContents.send('updater:event', { type: 'not-available', info });
    })

    autoUpdater.on('error', (err) => {
        sendStatusToWindow('Error in auto-updater. ' + err);
        if (win && !win.isDestroyed()) win.webContents.send('updater:event', { type: 'error', error: err.message });
    })

    autoUpdater.on('download-progress', (progressObj) => {
        let log_message = "Download speed: " + progressObj.bytesPerSecond;
        log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
        log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
        sendStatusToWindow(log_message);
        if (win && !win.isDestroyed()) win.webContents.send('updater:event', { type: 'progress', info: progressObj });
    })

    autoUpdater.on('update-downloaded', (info) => {
        sendStatusToWindow('Update downloaded', info);
        if (win && !win.isDestroyed()) win.webContents.send('updater:event', { type: 'downloaded', info });
    })

    // IPC Handlers for Updater
    ipcMain.handle('updater:check', () => {
        autoUpdater.checkForUpdates().catch(err => log.error('Error checking for updates:', err));
    })

    ipcMain.handle('updater:download', () => {
        autoUpdater.downloadUpdate().catch(err => log.error('Error downloading update:', err));
    })

    ipcMain.handle('updater:install', () => {
        autoUpdater.quitAndInstall();
    })

    ipcMain.handle('app:get-version', () => {
        return app.getVersion();
    })

    // Initial check (optional, maybe we want to leave it manual only)
    // autoUpdater.checkForUpdatesAndNotify().catch(err => log.error('Error checking for updates:', err))
}

app.whenReady().then(() => {
    createWindow()
    setupAutoUpdater()
})
