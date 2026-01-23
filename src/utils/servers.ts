const flagAssets = import.meta.glob('../flags/4x3/*.svg', { eager: true, query: '?url', import: 'default' })

export const getFlagAsset = (code: string) => {
    if (!code) return ''
    const path = `../flags/4x3/${code.toLowerCase()}.svg`
    return (flagAssets[path] as string) || ''
}

export const SERVER_DATA: Record<string, { name: string, flag: string, domain: string }> = {
    'tribalwars.ae': { name: 'Arabic', flag: 'ae', domain: 'https://www.tribalwars.ae' },
    'plemena.com': { name: 'Croatian', flag: 'hr', domain: 'https://www.plemena.com' },
    'divokekmeny.cz': { name: 'Czech', flag: 'cz', domain: 'https://www.divokekmeny.cz' },
    'tribalwars.dk': { name: 'Danish', flag: 'dk', domain: 'https://www.tribalwars.dk' },
    'tribalwars.nl': { name: 'Dutch', flag: 'nl', domain: 'https://www.tribalwars.nl' },
    'tribalwars.net': { name: 'English (International)', flag: 'un', domain: 'https://www.tribalwars.net' },
    'tribalwars.co.uk': { name: 'English (UK)', flag: 'gb', domain: 'https://www.tribalwars.co.uk' },
    'tribalwars.us': { name: 'English (US)', flag: 'us', domain: 'https://www.tribalwars.us' },
    'guerretribale.fr': { name: 'French', flag: 'fr', domain: 'https://www.guerretribale.fr' },
    'die-staemme.de': { name: 'German', flag: 'de', domain: 'https://www.die-staemme.de' },
    'fyletikesmaxes.gr': { name: 'Greek', flag: 'gr', domain: 'https://www.fyletikesmaxes.gr' },
    'klanhaboru.hu': { name: 'Hungarian', flag: 'hu', domain: 'https://www.klanhaboru.hu' },
    'tribals.it': { name: 'Italian', flag: 'it', domain: 'https://www.tribals.it' },
    'no.tribalwars.com': { name: 'Norwegian', flag: 'no', domain: 'https://no.tribalwars.com' },
    'plemiona.pl': { name: 'Polish', flag: 'pl', domain: 'https://www.plemiona.pl' },
    'tribalwars.com.br': { name: 'Portuguese (Brazil)', flag: 'br', domain: 'https://www.tribalwars.com.br' },
    'tribalwars.com.pt': { name: 'Portuguese (Portugal)', flag: 'pt', domain: 'https://www.tribalwars.com.pt' },
    'tribalwars.works': { name: 'Public Beta', flag: 'un', domain: 'https://www.tribalwars.works' },
    'triburile.ro': { name: 'Romanian', flag: 'ro', domain: 'https://www.triburile.ro' },
    'voynaplemyon.com/uk-ua': { name: 'Russian', flag: 'ru', domain: 'https://www.voynaplemyon.com/uk-ua' },
    'divoke-kmene.sk': { name: 'Slovakian', flag: 'sk', domain: 'https://www.divoke-kmene.sk' },
    'vojnaplemen.si': { name: 'Slovenian', flag: 'si', domain: 'https://www.vojnaplemen.si' },
    'guerrastribales.es': { name: 'Spanish', flag: 'es', domain: 'https://www.guerrastribales.es' },
    'tribalwars.se': { name: 'Swedish', flag: 'se', domain: 'https://www.tribalwars.se' },
    'staemme.ch': { name: 'Swiss German', flag: 'ch', domain: 'https://www.staemme.ch' },
    'tribalwars.net/th-th': { name: 'Thai', flag: 'th', domain: 'https://www.tribalwars.net/th-th' },
    'klanlar.org': { name: 'Turkish', flag: 'tr', domain: 'https://www.klanlar.org' },
    'ua.tribalwars.net': { name: 'Ukrainian', flag: 'ua', domain: 'https://ua.tribalwars.net/' },
}

export const getServerInfo = (acc: any) => {
    // 1. Determine Sigla (World Prefix)
    let sigla = '??'

    if (acc.worldPrefix) {
        sigla = acc.worldPrefix.toUpperCase()
    } else if (acc.world) {
        // Fallback: Try to extract from world URL
        try {
            const url = new URL(acc.world)
            const parts = url.hostname.split('.')
            if (parts.length > 0) {
                sigla = parts[0].toUpperCase()
            }
        } catch (e) {
            sigla = acc.world.substring(0, 4).toUpperCase()
        }
    }

    // 2. Determine Label & Flag
    let label = 'Desconhecido'
    let flagUrl = ''

    if (acc.server) {
        // Remove protocol and standard subdomains but keep country-specific subdomains if they are part of the key
        // The keys in SERVER_DATA are mostly 'domain.tld' or 'sub.domain.tld'
        // We need a robust matching strategy.
        // We'll try to match the full mapped domain first, then try to strip www.

        let rawServer = acc.server.toLowerCase();

        // Remove protocol
        rawServer = rawServer.replace(/(^\w+:|^)\/\//, '');

        // Case 1: Exact match in keys (e.g. 'tribalwars.com.br')
        // We need to handle 'www.' which might or might not be in the key users configured or we key by
        // keys in SERVER_DATA do NOT have 'www.' except... wait, I removed www in keys above.
        // But some might have other subdomains.
        // Let's normalize by stripping 'www.' at the start.
        const cleanServer = rawServer.replace(/^www\./, '');

        const serverData = SERVER_DATA[cleanServer];

        if (serverData) {
            label = serverData.name
            flagUrl = getFlagAsset(serverData.flag)
        } else {
            // Fallback for unknown servers
            label = cleanServer
            const parts = cleanServer.split('.')
            const tld = parts[parts.length - 1]
            // Simple TLD fallback
            if (tld && tld.length === 2 && tld !== 'net' && tld !== 'com') {
                flagUrl = getFlagAsset(tld)
            }
        }
    }

    return { sigla, label, flagUrl }
}
