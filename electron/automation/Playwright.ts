import { chromium, Browser, BrowserContext, Page } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const PLAYWRIGHT_DEFAULTS = {
    CHANNEL: "msedge",
    HEADLESS: false,
    ARGS: [
        "--disable-blink-features=AutomationControlled",
        "--window-position=0,0",
        "--no-sandbox",
        "--disable-setuid-sandbox"
    ],

    VIEWPORT: null,
    DEFAULT_TIMEOUT: 0,
    NAVIGATION_TIMEOUT: 60000,
    GAME_PATH: "/game.php?screen=overview",

    CLICK: { force: true },
    CHROME_NOT_FOUND: "Erro ao abrir o Chrome. Verifique a instalação e tente novamente.",

    SELECTORS: {
        USERNAME: 'input#user',
        PASSWORD: 'input#password',
        SUBMIT: 'a.btn-login',
        WORLDS: '.worlds-container',
        SCREEN: /screen=/,
        WORLD_LINK: (prefix: string) => `a.world-select[href*="${prefix}"], a:has(.world_button_active)[href*="${prefix}"]`,
        RES: {
            WOOD: '#wood',
            STONE: '#stone',
            IRON: '#iron',
            STORAGE: '#storage',
            FARM: '#header_farm_text'
        },
        UNITS: {
            SPEAR: '.unit-item-spear span.unit_a_count',
            SWORD: '.unit-item-sword span.unit_a_count',
            SPY: '.unit-item-spy span.unit_a_count',
            LIGHT: '.unit-item-light span.unit_a_count',
            TABLE_SPEAR: 'strong[data-count="spear"]',
            TABLE_SWORD: 'strong[data-count="sword"]',
            TABLE_SPY: 'strong[data-count="spy"]',
            TABLE_LIGHT: 'strong[data-count="light"]',
        }
    }
};

export class Playwright {
    private proxy: any;
    private cookies: any[];
    private server: any;
    private world: any;
    private name: any;
    private password: any;
    private windowSize: string;
    private closeSession: boolean;
    private closeCaptcha: boolean;
    private onStatusUpdate?: (status: string) => void;
    private onCaptchaUpdate?: (hasCaptcha: boolean) => Promise<void>;
    private preferredBrowser: string = PLAYWRIGHT_DEFAULTS.CHANNEL || 'chrome'; // 'chrome', 'msedge', 'brave', 'opera'


    private hasCaptcha: boolean = false;
    private discordWebhook: string | undefined;
    private lastCaptchaNotification: number = 0;

    private browser: Browser | null = null;
    private context: BrowserContext | null = null;
    public page: Page | null = null;

    constructor(options: any) {
        const { config: { proxy, cookies = [], server, world, name, password, config, globalSettings, discordWebhook, lastCaptchaNotification }, browser: { windowSize, closeSession, closeCaptcha, browser }, onStatusUpdate, onCaptchaUpdate } = options;

        this.proxy = proxy;
        this.cookies = cookies;
        this.server = server;
        this.world = world;
        this.name = name;
        this.password = password;
        this.windowSize = windowSize || '1280,720';
        this.closeSession = closeSession;
        this.closeCaptcha = closeCaptcha;
        this.preferredBrowser = browser || PLAYWRIGHT_DEFAULTS.CHANNEL || 'chrome';

        this.onStatusUpdate = onStatusUpdate;
        this.onCaptchaUpdate = onCaptchaUpdate;

        this.discordWebhook = discordWebhook || (config && config.discordWebhook) || (globalSettings && globalSettings.discordWebhook);
        this.lastCaptchaNotification = lastCaptchaNotification || (config && config.lastCaptchaNotification) || 0;
    }

    async sendDiscordNotification(message: string) {
        if (!this.discordWebhook) return;
        try {
            await fetch(this.discordWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: message })
            });
        } catch (e) {
            console.error('Discord Notification Error:', e);
        }
    }

    static async init(options: any) {
        const instance = new Playwright(options);
        return await instance.start();
    }

    async shutdown(allowed: boolean) {
        if (allowed && this.browser) {
            await this.browser.close();
        }
    }

    async setStatus(message: string) {
        // Emit status update to parent if callback exists
        if (this.onStatusUpdate) {
            this.onStatusUpdate(message);
        }

        if (!this.page) return;
        try {
            await this.page.evaluate((msg) => {
                let el = document.getElementById('pw-status-overlay');
                if (!el) {
                    el = document.createElement('div');
                    el.id = 'pw-status-overlay';
                    el.style.position = 'fixed';
                    el.style.bottom = '10px';
                    el.style.right = '10px';
                    el.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    el.style.color = '#fff';
                    el.style.padding = '10px 20px';
                    el.style.borderRadius = '5px';
                    el.style.zIndex = '999999';
                    el.style.fontFamily = 'monospace';
                    el.style.fontSize = '14px';
                    el.style.pointerEvents = 'none';
                    document.body.appendChild(el);
                }
                el.innerText = `Status: ${msg}`;
            }, message);
        } catch (e) {
            // Ignore errors if page is closed or evaluating fails
        }
    }

    async waitCaptchaResolve() {
        if (!this.page) return null;
        try {
            // Check via API
            const worldDomain = this.world?.domain || this.server?.domain;
            const received = await this.page.request.get(`${worldDomain}/game.php?screen=api&ajax=ping&ts=${Date.now()}`, { headers: { "Tribalwars-ajax": "1" } });
            const response = await received.json();

            // Check via DOM (User reported specific elements)
            const hasDomCaptcha = await this.page.evaluate(() => {
                return !!(document.querySelector('.bot-protection-row') ||
                    document.querySelector('.captcha') ||
                    document.getElementById('bot_check'));
            });

            const captcha = response.bot_protect || hasDomCaptcha;
            if (!captcha) return null;

            if (captcha) {
                this.hasCaptcha = true;
                if (this.onCaptchaUpdate) await this.onCaptchaUpdate(true);
                await this.setStatus('Captcha detectado! Aguardando resolução...');

                // Discord Notification with 60min cooldown
                const now = Date.now();
                if (this.discordWebhook && (now - this.lastCaptchaNotification > 60 * 60 * 1000)) {
                    const worldName = this.world?.domain?.replace('https://', '') || 'Unknown';
                    await this.sendDiscordNotification(`⚠️ **Captcha Detectado!**\n👤 Conta: **${this.name}**\n🌍 Mundo: ${worldName}\n🔗 [Resolver](<${this.world?.domain}/game.php>)`);
                    this.lastCaptchaNotification = now;
                }
            }

            // Wait for manual resolution if visible, or just return status
            if (!PLAYWRIGHT_DEFAULTS.HEADLESS) {
                // In non-headless, we might want to wait for the user
                // For now, let's keep it simple as the user snippet
                await this.page.waitForResponse(/botcheck&ajaxaction=verify/, { timeout: 0 }).catch(() => { });
                this.hasCaptcha = false;
                if (this.onCaptchaUpdate) await this.onCaptchaUpdate(false);

                if (this.closeCaptcha) {
                    await this.shutdown(true);
                    return "CAPTCHA_RESOLVED_CLOSED";
                }

                return "CAPTCHA_RESOLVED";
            }

            return "CAPTCHA_DETECTED";
        } catch (e) {
            return null;
        }
    }

    async scrapeData() {
        if (!this.page) return null;
        try {
            return await this.page.evaluate((selectors) => {
                const getNumber = (sel: string) => {
                    const el = document.querySelector(sel);
                    if (!el) return 0;
                    return parseInt(el.textContent?.replace(/\./g, '') || '0', 10);
                };

                const gameData = (window as any).game_data;
                const hasCaptcha = !!(document.getElementById('bot_check') ||
                    document.querySelector('.captcha') ||
                    document.querySelector('.bot-protection-row'));

                if (gameData && gameData.village) {
                    return {
                        resources: {
                            wood: Math.floor(gameData.village.wood),
                            stone: Math.floor(gameData.village.stone),
                            iron: Math.floor(gameData.village.iron),
                            storage: parseInt(gameData.village.storage_max, 10)
                        },
                        farm: `${gameData.village.pop}/${gameData.village.pop_max}`,
                        units: {
                            spear: getNumber(selectors.UNITS.SPEAR) || getNumber(selectors.UNITS.TABLE_SPEAR),
                            sword: getNumber(selectors.UNITS.SWORD) || getNumber(selectors.UNITS.TABLE_SWORD),
                            spy: getNumber(selectors.UNITS.SPY) || getNumber(selectors.UNITS.TABLE_SPY),
                            light: getNumber(selectors.UNITS.LIGHT) || getNumber(selectors.UNITS.TABLE_LIGHT),
                        },
                        incoming: gameData.player?.incomings || 0,
                        points: parseInt(gameData.player?.points || '0', 10),
                        premiumPoints: parseInt(gameData.player?.pp || '0', 10),
                        hasCaptcha
                    };
                }
                return { hasCaptcha };
            }, { UNITS: PLAYWRIGHT_DEFAULTS.SELECTORS.UNITS });
        } catch (error) {
            return null;
        }
    }

    async withCookies() {
        if (!this.page) return null;
        const worldDomain = this.world?.domain || this.server?.domain;


        await this.page.goto(worldDomain + PLAYWRIGHT_DEFAULTS.GAME_PATH);

        try {
            await this.page.waitForURL((url) => {
                const u = url.toString();
                return u.includes('screen=') || u.includes('session_expired=1');
            }, { timeout: PLAYWRIGHT_DEFAULTS.NAVIGATION_TIMEOUT });

            // ADICIONE ESTE TRECHO - aguarda um pouco para garantir que os cookies do mundo foram setados
            await this.page.waitForTimeout(1000);

            return await this.waitCaptchaResolve();
        } catch (e) {
            return null;
        }
    }

    setupPageEvents() {
        if (this.page && this.browser) {
            this.page.on("close", () => this.browser?.close());
        }
    }

    // Substitua o método start() pelo código abaixo:

    async start() {
        let bestCookies: any[] = this.cookies || [];

        const updateBestCookies = async () => {
            if (!this.context) return;
            try {
                const urls = [
                    this.server?.domain,
                    this.world?.domain,
                    this.page ? this.page.url() : null
                ].filter((u): u is string => !!u);

                const allCookies = await this.context.cookies().catch(() => []);
                const specificCookies = urls.length > 0 ? await this.context.cookies(urls).catch(() => []) : [];

                const cookieMap = new Map();
                [...allCookies, ...specificCookies].forEach(c => {
                    cookieMap.set(c.name + c.domain, c);
                });
                const current = Array.from(cookieMap.values());

                if (current.length > 0) {
                    bestCookies = current;
                }
            } catch (error) {
                // Ignore errors if context is closed
            }
        };

        try {
            // Browser Launch com Proxy via Args
            let launchOptions: any = {
                headless: PLAYWRIGHT_DEFAULTS.HEADLESS,
                args: [...PLAYWRIGHT_DEFAULTS.ARGS, `--window-size=${this.windowSize}`]
            };

            // IMPORTANTE: Adicionar proxy via args do Chrome
            if (this.proxy) {
                const proxyServer = `${this.proxy.proxy_address}:${this.proxy.port}`;
                launchOptions.args.push(`--proxy-server=http://${proxyServer}`);
                console.log(`[Playwright] Configurando proxy: ${proxyServer}`);
            }

            const getExecutablePath = (browserName: string): string | undefined => {
                const isWin = process.platform === 'win32';
                if (!isWin) return undefined;

                if (browserName === 'brave') {
                    const paths = [
                        `C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe`,
                        `C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe`,
                        `${process.env.LOCALAPPDATA}\\BraveSoftware\\Brave-Browser\\Application\\brave.exe`
                    ];
                    return paths.find(p => fs.existsSync(p));
                }

                if (browserName === 'opera') {
                    const paths = [
                        `${process.env.LOCALAPPDATA}\\Programs\\Opera\\launcher.exe`,
                        `${process.env.LOCALAPPDATA}\\Programs\\Opera GX\\launcher.exe`,
                        `C:\\Program Files\\Opera\\launcher.exe`,
                        `C:\\Program Files\\Opera GX\\launcher.exe`
                    ];
                    return paths.find(p => fs.existsSync(p));
                }

                return undefined;
            }

            const attempts = [];

            if (this.preferredBrowser === 'brave') {
                const path = getExecutablePath('brave');
                if (path) attempts.push({ executablePath: path, name: 'Brave' });
                else console.warn('[Playwright] Brave executable not found.');
            } else if (this.preferredBrowser === 'opera') {
                const path = getExecutablePath('opera');
                if (path) attempts.push({ executablePath: path, name: 'Opera' });
                else console.warn('[Playwright] Opera executable not found.');
            } else if (this.preferredBrowser === 'msedge') {
                attempts.push({ channel: 'msedge', name: 'Edge' });
            } else {
                attempts.push({ channel: 'chrome', name: 'Chrome' });
            }

            if (this.preferredBrowser !== 'chrome') attempts.push({ channel: 'chrome', name: 'Chrome (Fallback)' });
            if (this.preferredBrowser !== 'msedge') attempts.push({ channel: 'msedge', name: 'Edge (Fallback)' });
            attempts.push({ channel: undefined as any, name: 'Bundled Chromium (Fallback)' });

            let lastError;
            let launched = false;

            for (const attempt of attempts) {
                try {
                    console.log(`[Playwright] Attempting to launch: ${attempt.name}`);

                    const currentOptions = { ...launchOptions };
                    if (attempt.channel) currentOptions.channel = attempt.channel;
                    if (attempt.executablePath) currentOptions.executablePath = attempt.executablePath;

                    this.browser = await chromium.launch(currentOptions);
                    console.log(`[Playwright] Browser launched successfully: ${attempt.name}`);
                    launched = true;
                    break;
                } catch (e: any) {
                    console.error(`[Playwright] Failed to launch ${attempt.name}:`, e.message);
                    lastError = e;
                }
            }

            if (!launched || !this.browser) {
                throw new Error(`Falha ao abrir o navegador. Erro: ${lastError?.message}`);
            }

            const contextOptions: any = {
                viewport: PLAYWRIGHT_DEFAULTS.VIEWPORT,
            };

            if (this.proxy && this.proxy.username && this.proxy.password) {
                contextOptions.httpCredentials = {
                    username: this.proxy.username,
                    password: this.proxy.password
                };
            }

            this.context = await this.browser.newContext(contextOptions);
            this.page = await this.context.newPage();

            this.setupPageEvents();

            await this.context.addCookies(this.cookies);
            await updateBestCookies();
            let hasSid = bestCookies.some(c => c.name.toLowerCase() === 'sid');
            let hasAuth = bestCookies.some(c => c.name.toLowerCase().includes("auth"));

            if (hasAuth && hasSid) {
                await this.setStatus('Sessão ativa detectada! Indo para o jogo...');
                const captchaStatus = await this.withCookies();

                const currentUrl = this.page.url();
                if (currentUrl.includes('session_expired=1')) {
                    await this.setStatus('Sessão expirada detectada! Tentando reconectar...');
                    hasSid = false;
                }
                else if (captchaStatus === "CAPTCHA_RESOLVED_CLOSED") {
                    return {
                        cookies: bestCookies,
                        data: {
                            hasCaptcha: false,
                            lastCaptchaNotification: this.lastCaptchaNotification
                        }
                    };
                }
                else if (captchaStatus === "CAPTCHA_DETECTED") {
                    await this.setStatus('Captcha detectado! Pausando...');
                }
            }

            if (!hasAuth || !hasSid) {
                await this.page.goto(this.server.domain);
                await updateBestCookies();

                if (!bestCookies.some(c => c.name.toLowerCase().includes("auth"))) {
                    await this.setStatus('Realizando login...');

                    const userFieldVisible = await this.page.locator(PLAYWRIGHT_DEFAULTS.SELECTORS.USERNAME).isVisible().catch(() => false);
                    if (userFieldVisible) {
                        await this.page.locator(PLAYWRIGHT_DEFAULTS.SELECTORS.USERNAME).fill(this.name);
                        await this.page.locator(PLAYWRIGHT_DEFAULTS.SELECTORS.PASSWORD).fill(this.password);
                        await this.page.locator(PLAYWRIGHT_DEFAULTS.SELECTORS.SUBMIT).click();
                        await this.page.waitForLoadState('networkidle');
                    }
                }

                const worldPrefix = this.world?.domain.split('//')[1]?.split('.')[0];
                await this.setStatus(`Aguardando seleção do mundo (${worldPrefix})...`);

                for (let i = 0; i < 60; i++) {
                    await updateBestCookies();
                    const currentUrl = this.page.url();

                    if (currentUrl.includes('/page/join/')) {
                        await this.setStatus('Confirmando entrada no mundo...');
                        await this.page.click('button.btn[type="submit"]').catch(() => { });
                    }

                    if (currentUrl.includes('game.php') && currentUrl.includes('screen=') && !currentUrl.includes('session_expired=1')) {
                        await this.setStatus('Entrando no mundo...');
                        const data = await this.scrapeData();
                        if (data && ((data.resources?.wood ?? 0) > 0 || (data.units?.spear ?? 0) > 0)) {
                            await this.setStatus('Dados do jogo detectados!');
                        }
                        break;
                    }

                    if (worldPrefix) {
                        const worldSelector = `a.world-select[href*="${worldPrefix}"], a:has(.world_button_active)[href*="${worldPrefix}"], a[href*="/page/play/${worldPrefix}"]`;
                        if (await this.page.locator(worldSelector).count() > 0) {
                            await this.setStatus(`Mundo ${worldPrefix} encontrado! Clicando...`);
                            await this.page.click(worldSelector, { force: true }).catch(() => { });
                        }
                    }

                    await this.page.waitForTimeout(1000);
                }
            }

            await this.page.waitForURL(/game\.php/, { timeout: 15000 }).catch(() => { });

            const worldDomain = this.world?.domain || this.server?.domain;
            const currentUrl = this.page.url();

            if (!currentUrl.includes(worldDomain.replace('https://', '').replace('http://', ''))) {
                await this.page.goto(worldDomain + PLAYWRIGHT_DEFAULTS.GAME_PATH);
                await this.page.waitForLoadState('networkidle');
                await this.page.waitForTimeout(2000);
            }

            let currentData = await this.scrapeData();
            if (!currentData || (currentData.resources?.wood ?? 0) === 0) {
                await this.setStatus('Aguardando cookies do mundo (SID/Sessão)...');
                for (let i = 0; i < 20; i++) {
                    await updateBestCookies();

                    const intermediateData = await this.scrapeData();
                    if (intermediateData && (intermediateData.resources?.wood ?? 0) > 0) {
                        break;
                    }

                    await this.page.waitForTimeout(1000).catch(() => { });
                }
            }

            const finalData = await this.scrapeData();
            if (this.hasCaptcha && finalData) {
                finalData.hasCaptcha = true;
            }

            await updateBestCookies();

            if (this.closeSession) {
                await this.shutdown(true);
            }

            return {
                cookies: bestCookies,
                data: {
                    ...finalData,
                    lastCaptchaNotification: this.lastCaptchaNotification
                }
            };

        } catch (error: any) {
            console.error('[Playwright] Error:', error);
            if (this.closeSession) await this.shutdown(true);
            return { cookies: bestCookies, error: error.message };
        }
    }
}
