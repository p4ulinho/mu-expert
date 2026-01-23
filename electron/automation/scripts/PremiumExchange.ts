import { AutomationScript, ScriptContext } from './index';
import { Logger } from '../Logger';
import { Page } from 'playwright';

export class PremiumExchangeScript implements AutomationScript {
    public async injectConfig(page: Page, config: any) {
        if (!config.premiumExchange?.active) return;

        await page.evaluate((config) => {
            // 1. Construct Key
            const w = window as any;
            const playerId = w.game_data?.player?.id;
            const world = w.game_data?.world;
            const villageId = w.game_data?.village?.id;

            if (playerId && world && villageId) {
                const key = `PL_MARKET_${playerId}_${world}`;
                const safeJSON = (data: any) => JSON.stringify(data);

                let existingData: any = { villages: {} };
                try {
                    const existing = localStorage.getItem(key);
                    if (existing) existingData = JSON.parse(existing);
                } catch (e) { }

                // Ensure villages object exists
                if (!existingData.villages) existingData.villages = {};

                // Update specific village config
                const settings = config.premiumExchange || {};

                existingData.villages[villageId] = {
                    ...existingData.villages[villageId],
                    ...settings
                };

                localStorage.setItem(key, safeJSON(existingData));

                console.log('Automated Premium Exchange Config Injected:', {
                    key,
                    villageConfig: existingData.villages[villageId]
                });
            }
        }, config);
    }

    async run(context: ScriptContext): Promise<void> {
        const { page, config, game_data } = context;
        if (!game_data?.village) {
            Logger.error('PremiumExchange', 'Game data invalid (no village)');
            return;
        }

        const peConfig = config.premiumExchange;
        if (!peConfig?.active) return;

        await this.injectConfig(page, config);
        const villageId = game_data.village.id;

        Logger.info('PremiumExchange', `Running User Script for village: ${game_data.village.name}`);

        // 1. Navigate to Market Exchange
        const url = `${page.url().split('?')[0]}?village=${villageId}&screen=market&mode=exchange`;
        if (page.url() !== url && !page.url().includes('mode=exchange')) {
            await page.goto(url);
            await page.waitForLoadState('domcontentloaded');
        }

        // 2. Prepare LocalStorage (Key: PL_MARKET_${player_id}_${world})
        // Handled by injectConfig above.


        // 3. Inject User Script
        const path = require('path');
        // ADJUSTED PATH
        const scriptPath = path.resolve(__dirname, '../../../scripts-final/PremiumExchange.user.js');

        try {
            const fs = require('fs');
            if (fs.existsSync(scriptPath)) {
                const content = await fs.promises.readFile(scriptPath, 'utf8');
                await page.addScriptTag({ content: content });
                Logger.info('PremiumExchange', 'User script injected successfully.');

                // Allow some time for script to run
                await page.waitForTimeout(11000);
            } else {
                Logger.error('PremiumExchange', `User script not found at: ${scriptPath}`);
            }
        } catch (e: any) {
            Logger.error('PremiumExchange', `Failed to inject script: ${e.message}`);
        }
    }
}
