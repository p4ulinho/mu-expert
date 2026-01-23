import axios from 'axios';

/**
 * Processa um arquivo de texto contendo contas
 * Formato esperado: Usuario:Senha ou Usuario;Senha ou Usuario,Senha ou Usuario\tSenha
 */
export function processAccountsFile(fileContent: string) {
    const lines = fileContent.split(/\r?\n/);
    const validAccounts: any[] = [];
    const invalidLines: any[] = [];

    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const originalLine = line;

        if (line.trim() === '') return;

        // Normaliza separadores (; , \t) para :
        const normalizedLine = line.trim().replace(/[;,\t]+/, ':');
        const parts = normalizedLine.split(/:/);

        if (parts.length < 2) {
            invalidLines.push({ lineNumber, value: originalLine, error: 'Formato inválido ou separador ausente.', });
            return;
        }

        const username = parts[0].trim();
        const password = parts.slice(1).join(':').trim();

        if (!username) {
            invalidLines.push({ lineNumber, value: originalLine, error: 'Nome de usuário ausente.', });
        } else if (!password) {
            invalidLines.push({ lineNumber, value: originalLine, error: 'Senha ausente.', });
        } else {
            validAccounts.push({ username, password });
        }
    });

    return {
        validAccounts,
        invalidLines,
        summary: {
            totalLinesProcessed: lines.length,
            validCount: validAccounts.length,
            invalidCount: invalidLines.length,
        }
    };
}

/**
 * Busca a lista de mundos ativos para um servidor
 */
export async function getServers(domains: string | string[]) {
    const domainList = Array.isArray(domains) ? domains : [domains];
    if (!domainList.length) return {};

    try {
        const requestPromises = domainList.map(domain => {
            return axios.get(`${domain}/backend/get_servers.php`);
        });

        const responses = await Promise.all(requestPromises);
        const allWorlds: Record<string, string> = {};
        const regex = /s:\d+:"([^"]+)";s:\d+:"([^"]+)";/g;

        for (const response of responses) {
            if (!response || typeof response.data !== 'string') continue;

            for (const match of response.data.matchAll(regex)) {
                const prefix = match[1];
                const worldDomain = match[2];
                allWorlds[prefix] = worldDomain;
            }
        }

        return allWorlds;
    } catch (err) {
        console.error('Error fetching servers:', err);
        return {};
    }
}
