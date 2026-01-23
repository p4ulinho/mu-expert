const mapping: Record<string, string> = {
    'ne': 'no',
    'nw': 'nw',
    'se': 'so',
    'sw': 'sw',
    'random': 'random',
    'multi': 'ally_center'
};

export class RelocateScript {
    async run(context: any) {
        const { page, config, userUuid, accountId, apiUrl, accountId: currentAccountId } = context;
        const settings = config.globalSettings?.relocate;

        if (!settings?.active) return;

        // ===== Queue Logic (mantida exatamente como você fez) =====
        if (settings.accountIds &&
            Array.isArray(settings.accountIds) &&
            settings.accountIds.length > 0) {

            if (!settings.accountIds.includes(currentAccountId)) {
                return; // Account not in queue
            }

        } else if (settings.accountIds &&
            Array.isArray(settings.accountIds) &&
            settings.accountIds.length === 0) {

            return; // fila vazia = não executar
        }

        const url: string = page.url();

        if (url.includes('/create_village.php')) {
            console.log('[RelocateScript] Village creation page detected.');

            const direction: string = settings.direction || 'random';
            let valueToSelect: string = 'random';

            if (mapping[direction]) {
                valueToSelect = mapping[direction];
            }

            console.log(`[RelocateScript] Selecting direction: ${direction} (Game Value: ${valueToSelect})`);

            try {

                // ===== FLUXO PADRÃO =====
                if (direction !== "multi") {

                    const selector = `input[name="direction"][value="${valueToSelect}"]`;

                    if (await page.locator(selector).isVisible()) {
                        await page.click(selector);
                    } else {
                        console.warn(`[RelocateScript] Direction radio button for ${valueToSelect} not found.`);
                        return;
                    }

                    // ===== FLUXO ESPECIAL MULTI (CORRETO PARA TS) =====
                } else {

                    const radios = page.locator('input[name="direction"]');
                    const count: number = await radios.count();

                    if (count === 0) {
                        console.warn('[RelocateScript] No direction radios available.');
                        return;
                    }

                    // clicar em uma direção real existente como base
                    await radios.nth(0).click();

                    // 👉 alteração ocorre no RADIO QUE FICOU CHECKED
                    await page.evaluate(() => {
                        const checked = document.querySelector<HTMLInputElement>(
                            'input[name="direction"]:checked'
                        );

                        if (checked) {
                            checked.value = "ally_center";
                            checked.setAttribute("value", "ally_center");
                        }
                    });

                    console.log('[RelocateScript] Checked radio forced to ally_center.');
                }

                // ===== CONFIRMAÇÃO =====
                const btnSelector = 'input.btn[type="submit"]';

                if (await page.locator(btnSelector).isVisible()) {
                    console.log('[RelocateScript] Confirming relocation...');
                    await page.click(btnSelector);

                    await page.waitForTimeout(20000);

                } else {
                    console.warn('[RelocateScript] Confirm button not found.');
                }

            } catch (error) {
                console.error('[RelocateScript] Error executing relocation:', error);
            }
        }
    }

    async removeFromQueue(
        userUuid: string,
        accountId: string,
        currentRelocateSettings: any,
        apiUrl: string
    ) {
        try {
            const newAccountIds: string[] =
                currentRelocateSettings.accountIds.filter(
                    (id: string) => id !== accountId
                );

            const newSettings = {
                ...currentRelocateSettings,
                accountIds: newAccountIds
            };

            await fetch(`${apiUrl}/api/users/${userUuid}/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    settings: { relocate: newSettings }
                })
            });

            console.log(`[Relocate] Account ${accountId} removed from queue.`);

        } catch (err: any) {
            console.error(
                '[Relocate] Failed to remove account from queue:',
                err.message
            );
        }
    }
}
