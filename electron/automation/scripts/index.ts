export { RecruitmentScript } from './Recruitment';
export { ScavengeScript } from './Scavenge';
export { PremiumExchangeScript } from './PremiumExchange';
export { DailyBonusScript } from './DailyBonus';
export { ConstructionScript } from './Construction';
import { Page } from 'playwright';

export interface ScriptContext {
    page: Page;
    config: any;
    game_data: any; // Scraped data or global objects
}

export interface AutomationScript {
    run(context: ScriptContext): Promise<void>;
}
