
interface Proxy {
    _id: string
    address: string
    port: string
    username?: string
    password?: string
}

interface Account {
    _id: string
    server: string
    worldPrefix: string
    proxy: string // Format: "ip:port:user:pass" or "Sem Proxy"
}

/**
 * Smart Proxy Assignment Strategy
 * 
 * Rules:
 * 1. A proxy CANNOT be used by more than one account on the SAME world.
 * 2. A proxy CAN be reused across DIFFERENT worlds.
 * 3. Preference is given to proxies that are completely unused first (optional, but good for load balancing), 
 *    or simply round-robin among available candidates.
 * 4. If all proxies are used in the target world, return null/empty.
 * 
 * @param targetWorldPrefix - The world prefix (e.g., 'br120')
 * @param accounts - All existing accounts
 * @param proxies - All available proxies
 * @param currentUsage - Optional map of temporary usage (for bulk add)
 */
export const getSmartProxy = (
    targetWorldPrefix: string,
    accounts: Account[],
    proxies: Proxy[],
    temporaryUsageInBatch: Set<string> = new Set() // Proxies already assigned in current batch for this world
): string | null => {
    if (!proxies || proxies.length === 0) return null

    // 1. Identify proxies ALREADY used in this world by existing accounts
    const usedInWorld = new Set<string>()

    accounts.forEach(acc => {
        // Check if account is on the same world (and server? assuming server is implicit or we should check full url)
        // ideally we should match server too, but usually worldPrefix is unique enough per server context 
        // or we pass full logic. For now, assuming worldPrefix is key.
        if (acc.worldPrefix === targetWorldPrefix && acc.proxy && acc.proxy !== 'Sem Proxy') {
            usedInWorld.add(acc.proxy)
        }
    })

    // 2. Identify proxies used in the current batch (Bulk Add) for this world
    // temporaryUsageInBatch contains full proxy strings assigned during this bulk operation

    // 3. Filter candidates
    const candidates = proxies.filter(p => {
        const fullProxy = `${p.address}:${p.port}${p.username ? `:${p.username}` : ''}${p.password ? `:${p.password}` : ''}`

        // precise match check
        // We construct the string to match what is saved in Account

        if (usedInWorld.has(fullProxy)) return false
        if (temporaryUsageInBatch.has(fullProxy)) return false

        return true
    })

    if (candidates.length === 0) return null

    // 4. Sort candidates to load balance across OTHER worlds?
    // We can count total global usage of each candidate
    const globalUsageCount: Record<string, number> = {}

    candidates.forEach(p => {
        const fullProxy = `${p.address}:${p.port}${p.username ? `:${p.username}` : ''}${p.password ? `:${p.password}` : ''}`
        globalUsageCount[fullProxy] = 0
    })

    accounts.forEach(acc => {
        if (acc.proxy && acc.proxy !== 'Sem Proxy' && globalUsageCount[acc.proxy] !== undefined) {
            globalUsageCount[acc.proxy]++
        }
    })

    // Sort ascending by usage count
    candidates.sort((a, b) => {
        const fullA = `${a.address}:${a.port}${a.username ? `:${a.username}` : ''}${a.password ? `:${a.password}` : ''}`
        const fullB = `${b.address}:${b.port}${b.username ? `:${b.username}` : ''}${b.password ? `:${b.password}` : ''}`
        return globalUsageCount[fullA] - globalUsageCount[fullB]
    })

    // Return best candidate
    const best = candidates[0]
    return `${best.address}:${best.port}${best.username ? `:${best.username}` : ''}${best.password ? `:${best.password}` : ''}`
}
