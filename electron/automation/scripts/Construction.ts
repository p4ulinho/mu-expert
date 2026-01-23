import { AutomationScript, ScriptContext } from './index';
import { Logger } from '../Logger';

export class ConstructionScript implements AutomationScript {
    async run(context: ScriptContext): Promise<void> {
        const { page, config, game_data } = context;
        if (!game_data?.village) {
            Logger.error('Construction', 'Game data invalid (no village)');
            return;
        }
        const villageId = game_data.village.id;

        const globalSettings = (config as any).globalSettings || {};
        const constructionSettings = globalSettings.construction || {};

        if (!config.construction?.active) return;

        // Inject configuration for the script to read directly
        await page.evaluate((config) => {
            // Helper to safe-stringify
            const safeJSON = (data: any) => JSON.stringify(data);

            // 23: Prepare Model Data
            const constructionConfig = config.construction || {};
            const accountName = ((config as any).name || "Account");
            const modelName = constructionConfig.name
                ? constructionConfig.name
                : `${accountName} Config`;

            // Transform buildingOrder (string[]) to [[name, level]] format
            const buildingOrder = constructionConfig.buildingOrder || [];
            const buildings: [string, number][] = [];

            // We interpret the order as sequential upgrades
            const impliedLevels: Record<string, number> = {};

            for (const item of buildingOrder) {
                // Handle various formats if necessary, but assuming string "main" or "barracks"
                let name = item;
                if (typeof item === 'string') {
                    // Logic: If we see 'main' and we have seen it 0 times, implied level is 1.
                    // This assumes starting from 0. The userscript diff logic compares target vs current.
                    // If current is 20 and we define target 1, it does nothing.
                    // So effectively this list defines the SEQUENCE of upgrades the user WANTS.
                    // But the userscript "Model" feature is a "Target State" definition, not a relative queue usually.
                    // However, `createModelViaPost` in the script calculates diffs.
                    // If we provide specific levels increasing, it works.

                    const current = impliedLevels[name] || 0;
                    const next = current + 1;
                    impliedLevels[name] = next;
                    buildings.push([name, next]);
                }
            }

            const model = {
                name: modelName,
                buildings: buildings
            };

            const savedModels = [model];

            // 2. Set localStorage keys expected by MegaConstrutor.user.js

            // Models
            localStorage.setItem('savedModels', safeJSON(savedModels));

            // Active Model for THIS village
            const w = window as any;
            const villageId = w.game_data?.village?.id;
            if (villageId) {
                localStorage.setItem(`activeModel_${villageId}`, safeJSON(model));

                // Enable for this village
                const villageBuildON: any = {};
                villageBuildON[villageId] = true;
                localStorage.setItem('VillageBuildON', safeJSON(villageBuildON));
            }

            // General Settings
            // We map backend config keys to userscript keys. 
            // If backend doesn't provide them, we default to sensible values or existing ones.
            const s = config.construction || {};

            localStorage.setItem('upFarmOption', String(s.upgradeFarm ?? true));
            localStorage.setItem('upStorageOption', String(s.upgradeStorage ?? true));
            localStorage.setItem('build-with-premium', String(s.usePremium ?? false));
            localStorage.setItem('getRewards', String(s.claimQuests ?? true));

            localStorage.setItem('maxQueueSize', String(s.maxQueue || 2));
            localStorage.setItem('time-next-village-build', String(s.timeBetweenVillages || 240));
            localStorage.setItem('min-build-with-premium', String(s.minPremiumPoints || 30));

            localStorage.setItem('value-priority-farm', String(s.farmPriority || 25));
            localStorage.setItem('value-priority-storage', String(s.storagePriority || 100));

            // Log for debugging
            console.log('Automated Construction Config Injected:', {
                savedModels,
                activeModel: model,
                settings: s
            });

        }, config);
        Logger.info('Construction', `Running User Script for village: ${game_data.village.name}`);

        // 1. Navigate to "main" (Headquarters)
        const url = `${page.url().split('?')[0]}?village=${villageId}&screen=main`;
        if (page.url() !== url && !page.url().includes('screen=main')) {
            await page.goto(url);
            await page.waitForLoadState('domcontentloaded');
        }

        // 2. Legacy configuration injection removed. Using injectConfig above.

        // 3. Inject User Script
        const path = require('path');
        // ADJUSTED PATH: Up 3 levels from 'electron/automation/scripts' to root 'MULTI_EXPERT', then 'scripts-final'
        const scriptPath = path.resolve(__dirname, '../../../scripts-final/MegaConstrutor.user.js');

        try {
            const fs = require('fs');
            if (fs.existsSync(scriptPath)) {
                const content = await fs.promises.readFile(scriptPath, 'utf8');
                await page.addScriptTag({ content: content });
                Logger.info('Construction', 'User script injected successfully.');

                await page.waitForTimeout(8000);
            } else {
                Logger.error('Construction', `User script not found at: ${scriptPath}`);
            }
        } catch (e: any) {
            Logger.error('Construction', `Failed to inject script: ${e.message}`);
        }
    }
}
