import { AutomationScript, ScriptContext } from './index';
import { Logger } from '../Logger';

export class DailyBonusScript implements AutomationScript {
    async run(context: ScriptContext): Promise<void> {
        const { page, config, game_data } = context;
        if (!config.extraFunctions?.active) return;

        Logger.info('DailyBonus', `Checking daily bonus for account: ${config.name}`);

        try {
            // 1. Navigate to Daily Bonus Screen
            // Example URL from user: screen=info_player&mode=daily_bonus
            const url = `${page.url().split('?')[0]}?village=${game_data.village.id}&screen=info_player&mode=daily_bonus`;

            if (!page.url().includes('screen=info_player') || !page.url().includes('mode=daily_bonus')) {
                await page.goto(url);
                await page.waitForLoadState('domcontentloaded');
            }

            // 2. Look for openable chests/rewards
            // The user provided the class 'btn btn-default' and mentioned avoiding buttons with 'custo'.
            // In the HTML provided, we see: <div class="actions"><a href="#" class="btn btn-default">Abrir</a></div>

            const rewardsClickCount = await page.evaluate(() => {
                const rewardsGrid = document.querySelector('.rewards_grid');
                if (!rewardsGrid) return 0;

                let clicked = 0;
                // Select all buttons with EXACT class 'btn btn-default'
                // We also filter out any that might have "custo" or "Premium" in the parent description to be extra safe
                const buttons = Array.from(rewardsGrid.querySelectorAll('a.btn.btn-default'));

                for (const btn of buttons) {
                    const btnEl = btn as HTMLElement;

                    // Filter: Class must be exactly 'btn btn-default' (or at least strictly those two)
                    // If it has other classes like 'btn-premium' or 'btn-pp', skip.
                    if (btnEl.classList.length !== 2) continue;

                    // Robustness: Check text content for safety (Portuguese specific)
                    const text = btnEl.innerText.toLowerCase();
                    if (text.includes('abrir') || text.includes('coletar')) {
                        // Check for price indication in proximity
                        const chestContainer = btnEl.closest('.chest_container');
                        if (chestContainer) {
                            const chestTitle = chestContainer.querySelector('.db-chest')?.getAttribute('data-title') || '';
                            if (chestTitle.toLowerCase().includes('custo') || chestTitle.toLowerCase().includes('pp')) {
                                console.log('[DailyBonus] Skipping paid reward:', chestTitle);
                                continue;
                            }
                        }

                        btnEl.click();
                        clicked++;
                    }
                }
                return clicked;
            });

            if (rewardsClickCount > 0) {
                Logger.success('DailyBonus', `Collected ${rewardsClickCount} rewards successfully.`);
                // Wait a bit for the animations/server response
                await page.waitForTimeout(2000);
            } else {
                Logger.info('DailyBonus', 'No rewards available to collect today.');
            }

        } catch (error: any) {
            Logger.error('DailyBonus', `Error collecting daily bonus: ${error.message}`);
        }
    }
}
