import { AutomationScript, ScriptContext } from './index';
import { Logger } from '../Logger';

export class ScavengeScript implements AutomationScript {
    async run(context: ScriptContext): Promise<void> {
        const { page, config, game_data } = context;
        const scavengeConfig = config.scavenge || {};

        if (!scavengeConfig.active) return;

        Logger.info('Scavenge', `Running User Script for village: ${game_data.village.name}`);

        // 1. Navigate to Scavenge Screen (Page refresh required for script injection usually)
        const url = `${page.url().split('?')[0]}?village=${game_data.village.id}&screen=place&mode=scavenge`;
        if (page.url() !== url) {
            await page.goto(url);
            await page.waitForLoadState('domcontentloaded');
        }

        // 2. Prepare LocalStorage Data (Sync API config -> Userscript config)
        // Userscript expects "ScavengeConfig" in localStorage with specific flat structure
        const storageData = {
            autoCollect: true, // Force active when running via bot? Or respect config? Let's respect config but usually we want it to run.
            // Actually, the bot triggers the run. If autoCollect is false in valid config, script might not loop.
            // But we want it to execute at least once. 
            // The userscript 'run_all' calls 'coletaDesbloquear' and then checks autoCollect for loop.
            // Let's map 1:1.
            autoUnlock: scavengeConfig.autoUnlock,
            hours: scavengeConfig.hours || 2,
            distributionMode: scavengeConfig.distributionMode || 'prioritize',
            refresh_time: 900, // Sync with config or default
            units: scavengeConfig.units || { spear: true, sword: true, axe: true, archer: true, light: true, heavy: true, marcher: true },

            // Flatten reserves
            reserve_spear: scavengeConfig.reserves?.spear || 0,
            reserve_sword: scavengeConfig.reserves?.sword || 0,
            reserve_axe: scavengeConfig.reserves?.axe || 0,
            reserve_archer: scavengeConfig.reserves?.archer || 0,
            reserve_light: scavengeConfig.reserves?.light || 0,
            reserve_heavy: scavengeConfig.reserves?.heavy || 0,
            reserve_marcher: scavengeConfig.reserves?.marcher || 0,
        };

        // If autoCollect is not set in API, maybe default to true so it actually does something?
        // User said "com base no que está configurado na api".
        // If API has active=true (checked at start), presumably they want it to collect.
        storageData.autoCollect = true;

        await page.evaluate((data) => {
            localStorage.setItem('ScavengeConfig', JSON.stringify(data));
            console.log('[Scavenge] Injected configuration into LocalStorage:', data);
        }, storageData);

        // 3. Inject User Script
        // Path to the script relative to API root (assuming scripts-final is in project root)
        const path = require('path');
        // ADJUSTED PATH
        const scriptPath = path.resolve(__dirname, '../../../scripts-final/Scavenge.user.js');


        // We need to cast 'page' to 'any' or access the Playwright instance wrapper if we want to use 'runUserScript'
        // But 'page' here is a raw Playwright Page object passed from Scheduler.
        // Wait, context.page is Key, context.browser is unknown.
        // The 'Playwright' class instance isn't directly passed here, only the Page.
        // So I need to use fs and inject manually HERE, or refactor ScriptContext.
        // I'll stick to manual injection here reusing the logic I planned, to avoid changing interfaces.

        try {
            const fs = require('fs');
            if (fs.existsSync(scriptPath)) {
                const content = await fs.promises.readFile(scriptPath, 'utf8');
                await page.addScriptTag({ content: content });
                Logger.info('Scavenge', 'User script injected successfully.');

                // 3. Wait for execution (optional, script runs async)
                await page.waitForTimeout(8000);
            } else {
                Logger.error('Scavenge', `User script not found at: ${scriptPath}`);
            }
        } catch (e: any) {
            Logger.error('Scavenge', `Failed to inject script: ${e.message}`);
        }
    }
}
