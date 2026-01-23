import { AutomationScript, ScriptContext } from './index';
import { Logger } from '../Logger';
import { Page } from 'playwright';

// Maps unit names to their types for config lookup
const UNIT_TYPES: Record<string, 'infantry' | 'cavalry' | 'garage'> = {
    spear: 'infantry', sword: 'infantry', axe: 'infantry', archer: 'infantry',
    spy: 'cavalry', light: 'cavalry', marcher: 'cavalry', heavy: 'cavalry',
    ram: 'garage', catapult: 'garage'
};

export class RecruitmentScript implements AutomationScript {
    public async injectConfig(page: Page, config: any) {
        if (!config.recruitment?.active) return;

        await page.evaluate((config) => {
            const safeJSON = (data: any) => JSON.stringify(data);
            const accountName = (config as any).name || "API";
            // Use user-friendly model name
            const modelName = `${accountName} Config`;

            // 1. Prepare Model
            const defaultUnits = config.recruitment.units || {
                spear: 0, sword: 0, axe: 0, archer: 0, spy: 0,
                light: 0, marcher: 0, heavy: 0, ram: 0, catapult: 0,
                knight: 0, snob: 0, militi: 0
            };

            const recruitmentConfig = config.recruitment || {};

            const model = {
                name: modelName,
                // Spread Units
                ...defaultUnits,

                // Nest Limits/Settings into the model so they persist if the user re-applies the model
                // Settings (Try multiple key formats)
                time_next_village: recruitmentConfig.timeBetweenVillages || recruitmentConfig.time_next_village || 120,

                // Limits (Handle nested or flat)
                recruit_limit_infantry: recruitmentConfig.limits?.infantry ?? recruitmentConfig.limitInfantry ?? recruitmentConfig.recruit_limit_infantry ?? 5,
                recruit_limit_cavalry: recruitmentConfig.limits?.cavalry ?? recruitmentConfig.limitCavalry ?? recruitmentConfig.recruit_limit_cavalry ?? 2,
                recruit_limit_garage: recruitmentConfig.limits?.garage ?? recruitmentConfig.limitGarage ?? recruitmentConfig.recruit_limit_garage ?? 2,

                // Reserves (Handle nested or flat)
                reserve_wood: recruitmentConfig.reserves?.wood ?? recruitmentConfig.reserveWood ?? 0,
                reserve_stone: recruitmentConfig.reserves?.stone ?? recruitmentConfig.reserveStone ?? 0,
                reserve_iron: recruitmentConfig.reserves?.iron ?? recruitmentConfig.reserveIron ?? 0,
                reserve_pop: recruitmentConfig.reserves?.pop ?? recruitmentConfig.reservePop ?? 0,

                // Misc
                max_queue: recruitmentConfig.maxQueue || recruitmentConfig.max_queue || 2,
                autoResearch: recruitmentConfig.autoResearch || false,
                min_score: recruitmentConfig.minScore || 100
            };

            const recruitModels = [model];
            localStorage.setItem('recruit_models', safeJSON(recruitModels));

            // Inject Global Defaults for Script Usage
            const globalDefaults = {
                time_next_village: recruitmentConfig.timeBetweenVillages || recruitmentConfig.time_next_village || 120,
                recruit_limit_infantry: recruitmentConfig.limits?.infantry ?? recruitmentConfig.limitInfantry ?? recruitmentConfig.recruit_limit_infantry ?? 1,
                recruit_limit_cavalry: recruitmentConfig.limits?.cavalry ?? recruitmentConfig.limitCavalry ?? recruitmentConfig.recruit_limit_cavalry ?? 1,
                recruit_limit_garage: recruitmentConfig.limits?.garage ?? recruitmentConfig.limitGarage ?? recruitmentConfig.recruit_limit_garage ?? 1,
                max_queue: recruitmentConfig.maxQueue || recruitmentConfig.max_queue || 2,
                autoResearch: recruitmentConfig.autoResearch || false,
                min_score: recruitmentConfig.minScore || 100
            };
            localStorage.setItem('recruit_config_defaults', safeJSON(globalDefaults));

            // 2. Configure Village Settings
            const w = window as any;
            const villageId = w.game_data?.village?.id;
            const villageName = w.game_data?.village?.name || "Village";

            let villagesRecruit: any = {};
            if (villageId) {
                const existingStr = localStorage.getItem('villagesRecruit');
                if (existingStr) {
                    try { villagesRecruit = JSON.parse(existingStr); } catch (e) { }
                }

                const units = config.recruitment.units || {};

                villagesRecruit[villageId] = {
                    ...villagesRecruit[villageId],

                    // Standard Fields
                    villageON: true,
                    nameVillage: villageName,
                    model: modelName,

                    // Flattened Unit Counts
                    spear: units.spear || 0,
                    sword: units.sword || 0,
                    axe: units.axe || 0,
                    archer: units.archer || 0,
                    spy: units.spy || 0,
                    light: units.light || 0,
                    marcher: units.marcher || 0,
                    heavy: units.heavy || 0,
                    ram: units.ram || 0,
                    catapult: units.catapult || 0,

                    // Settings (Try multiple key formats)
                    time_next_village: recruitmentConfig.timeBetweenVillages || recruitmentConfig.time_next_village || 120,

                    // Limits (Handle nested or flat)
                    recruit_limit_infantry: recruitmentConfig.limits?.infantry ?? recruitmentConfig.limitInfantry ?? recruitmentConfig.recruit_limit_infantry ?? 5,
                    recruit_limit_cavalry: recruitmentConfig.limits?.cavalry ?? recruitmentConfig.limitCavalry ?? recruitmentConfig.recruit_limit_cavalry ?? 2,
                    recruit_limit_garage: recruitmentConfig.limits?.garage ?? recruitmentConfig.limitGarage ?? recruitmentConfig.recruit_limit_garage ?? 2,

                    // Reserves (Handle nested or flat)
                    reserve_wood: recruitmentConfig.reserves?.wood ?? recruitmentConfig.reserveWood ?? 0,
                    reserve_stone: recruitmentConfig.reserves?.stone ?? recruitmentConfig.reserveStone ?? 0,
                    reserve_iron: recruitmentConfig.reserves?.iron ?? recruitmentConfig.reserveIron ?? 0,
                    reserve_pop: recruitmentConfig.reserves?.pop ?? recruitmentConfig.reservePop ?? 0,

                    // Misc
                    max_queue: recruitmentConfig.maxQueue || recruitmentConfig.max_queue || 2,
                    autoResearch: recruitmentConfig.autoResearch || false,
                    min_score: recruitmentConfig.minScore || 100 // Added check for minScore
                };

                localStorage.setItem('villagesRecruit', safeJSON(villagesRecruit));

                console.log('Automated Recruitment Config Injected:', {
                    modelName,
                    villageConfig: villagesRecruit[villageId]
                });
            }

        }, config);
    }

    async run(context: ScriptContext): Promise<void> {
        const { page, config, game_data } = context;
        if (!game_data?.village) return;
        const villageId = game_data.village.id;

        // Call the new injectConfig method
        await this.injectConfig(page, config);

        Logger.info('Recruitment', `Running User Script for village: ${game_data.village.name}`);

        // 1. Navigate to "train" (Recruitment)
        // Check if we need to go to specific buildings? The script usually handles mass recruitment or individual pages.
        // Assuming the script runs on 'train'.
        // Some scripts prefer 'main' or 'train'. AutoRecrutamento often runs on train.
        const url = `${page.url().split('?')[0]}?village=${villageId}&screen=train`;
        if (page.url() !== url) {
            await page.goto(url);
            await page.waitForLoadState('domcontentloaded');
        }

        // 2. Inject User Script
        const path = require('path');
        // ADJUSTED PATH
        const scriptPath = path.resolve(__dirname, '../../../scripts-final/AutoRecrutamento.user.js');

        try {
            const fs = require('fs');
            if (fs.existsSync(scriptPath)) {
                const content = await fs.promises.readFile(scriptPath, 'utf8');
                await page.addScriptTag({ content: content });
                Logger.info('Recruitment', 'User script injected successfully.');

                // Wait a bit for script to initialize and run
                await page.waitForTimeout(8000);
            } else {
                Logger.error('Recruitment', `User script not found at: ${scriptPath}`);
            }
        } catch (e: any) {
            Logger.error('Recruitment', `Failed to inject script: ${e.message}`);
        }
    }

}
