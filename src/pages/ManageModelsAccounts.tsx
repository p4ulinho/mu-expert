import React, { useState, useEffect } from 'react'
import { Save, Layers, Filter, Search, Hammer, Users, Package, RefreshCw, CheckSquare, Square, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

import { getServerInfo, SERVER_DATA, getFlagAsset } from '../utils/servers'
import { CustomSelect } from '../components/ui/CustomSelect'

const formatWorld = (worldStr: string) => {
    try {
        // Check if it's a URL
        if (worldStr.startsWith('http')) {
            const url = new URL(worldStr)
            const parts = url.hostname.split('.')
            const prefix = parts[0].toUpperCase()
            const domain = parts.slice(1).join('.')

            const server = SERVER_DATA[domain]
            if (server) {
                // Extract country from "Language (Country)" or use full name
                const countryMatch = server.name.match(/\(([^)]+)\)/)
                const name = countryMatch ? countryMatch[1] : server.name
                return {
                    prefix,
                    name: name.toUpperCase(),
                    flag: getFlagAsset(server.flag)
                }
            }
            return { prefix, name: 'DESCONHECIDO', flag: '' }
        }
        // Fallback for non-URL strings
        return { prefix: worldStr, name: '', flag: '' }
    } catch {
        return { prefix: worldStr, name: '', flag: '' }
    }
}



interface Account {
    _id: string
    name: string
    world: string
    worldPrefix?: string
    server: string
    config?: {
        construction?: {
            active: boolean
            buildingOrder: string[]
            templateUuid?: string
        }
        recruitment?: {
            active: boolean
            units: any
            templateUuid?: string
        }
        scavenge?: {
            active: boolean
        }
        premiumExchange?: {
            active: boolean
        }
    }
}

interface StrategyModel {
    uuid: string
    name: string
    buildingOrder?: string[]
    units?: any
}

interface ManageModelsAccountsProps {
    userUuid: string
    navigateToTab: (tab: string) => void
}

const ManageModelsAccounts: React.FC<ManageModelsAccountsProps> = ({ userUuid, navigateToTab }) => {
    const [accounts, setAccounts] = useState<Account[]>([])
    const [constructionModels, setConstructionModels] = useState<StrategyModel[]>([])
    const [recruitmentModels, setRecruitmentModels] = useState<StrategyModel[]>([])
    const [loading, setLoading] = useState(true)

    // Selection State
    const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([])

    // UI State: Assignment Tracking
    const [assignments, setAssignments] = useState<Record<string, { construction: string, recruitment: string, scavenge: boolean, premiumExchange: boolean }>>({})
    const [initialAssignments, setInitialAssignments] = useState<Record<string, { construction: string, recruitment: string, scavenge: boolean, premiumExchange: boolean }>>({})

    // Filters
    const [filterWorld, setFilterWorld] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all') // 'all', 'configured', 'pending'
    const [searchTerm, setSearchTerm] = useState('')

    const loadData = async () => {
        if (!userUuid) return
        setLoading(true)
        try {
            const [accResult, constrResult, recrResult] = await Promise.all([
                (window as any).ipcRenderer.invoke('accounts:get', userUuid),
                (window as any).ipcRenderer.invoke('construction:get-models', userUuid),
                (window as any).ipcRenderer.invoke('recruitment:get-models', userUuid)
            ])

            const accs = accResult || []
            setAccounts(accs)
            setConstructionModels(constrResult?.models || [])
            setRecruitmentModels(recrResult?.models || [])

            const initialAssignments: any = {}
            if (Array.isArray(accs)) {
                accs.forEach((acc: Account) => {
                    initialAssignments[acc._id] = {
                        construction: acc.config?.construction?.templateUuid || '',
                        recruitment: acc.config?.recruitment?.templateUuid || '',
                        scavenge: acc.config?.scavenge?.active || false,
                        premiumExchange: acc.config?.premiumExchange?.active || false
                    }
                })
            }
            setAssignments(initialAssignments)
            setInitialAssignments(initialAssignments)

        } catch (err) {
            console.error('Error loading strategy data:', err)
            toast.error('Erro ao carregar dados.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [userUuid])

    // --- Filter Logic ---
    const getFilteredAccounts = () => {
        return accounts.filter(acc => {
            // World Filter
            if (filterWorld !== 'all' && acc.world !== filterWorld) return false

            // Status Filter
            const isConfigured = assignments[acc._id]?.construction || assignments[acc._id]?.recruitment
            if (filterStatus === 'configured' && !isConfigured) return false
            if (filterStatus === 'pending' && isConfigured) return false

            // Search
            if (searchTerm && !acc.name.toLowerCase().includes(searchTerm.toLowerCase())) return false

            return true
        })
    }

    const filteredAccounts = getFilteredAccounts()
    const uniqueWorlds = Array.from(new Set(accounts.map(a => a.world))).sort()

    // --- Selection Logic ---
    const toggleSelectAll = () => {
        if (selectedAccountIds.length === filteredAccounts.length) {
            setSelectedAccountIds([])
        } else {
            setSelectedAccountIds(filteredAccounts.map(a => a._id))
        }
    }

    const toggleSelect = (id: string) => {
        setSelectedAccountIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    // --- Assignment Logic ---
    const handleAssignmentChange = async (accountId: string, type: 'construction' | 'recruitment' | 'scavenge' | 'premiumExchange', value: any) => {
        setAssignments(prev => ({
            ...prev,
            [accountId]: {
                ...prev[accountId],
                [type]: value
            }
        }))
    }

    // --- Bulk Apply Logic ---
    const [bulkConstruction, setBulkConstruction] = useState('__IGNORE__')
    const [bulkRecruitment, setBulkRecruitment] = useState('__IGNORE__')
    const [bulkScavenge, setBulkScavenge] = useState('__IGNORE__')
    const [bulkPremiumExchange, setBulkPremiumExchange] = useState('__IGNORE__')

    const applyBulk = () => {
        const newAssignments = { ...assignments }
        let changedCount = 0

        selectedAccountIds.forEach(accId => {
            // Verify if account is in current filtered view (safety check)
            if (accounts.find(a => a._id === accId)) {
                if (bulkConstruction !== '__IGNORE__') {
                    if (!newAssignments[accId]) newAssignments[accId] = { construction: '', recruitment: '', scavenge: false, premiumExchange: false }
                    newAssignments[accId].construction = bulkConstruction
                    changedCount++
                }
                if (bulkRecruitment !== '__IGNORE__') {
                    if (!newAssignments[accId]) newAssignments[accId] = { construction: '', recruitment: '', scavenge: false, premiumExchange: false }
                    newAssignments[accId].recruitment = bulkRecruitment
                    changedCount++
                }
                if (bulkScavenge !== '__IGNORE__') {
                    if (!newAssignments[accId]) newAssignments[accId] = { construction: '', recruitment: '', scavenge: false, premiumExchange: false }
                    // value comes as string from select, convert to boolean
                    newAssignments[accId].scavenge = bulkScavenge === 'true'
                    changedCount++
                }
                if (bulkPremiumExchange !== '__IGNORE__') {
                    if (!newAssignments[accId]) newAssignments[accId] = { construction: '', recruitment: '', scavenge: false, premiumExchange: false }
                    newAssignments[accId].premiumExchange = bulkPremiumExchange === 'true'
                    changedCount++
                }
            }
        })

        if (changedCount > 0) {
            setAssignments(newAssignments)
            // Auto-save logic
            persistAssignments(newAssignments)

            setBulkConstruction('__IGNORE__')
            setBulkRecruitment('__IGNORE__')
            setBulkScavenge('__IGNORE__')
            setBulkPremiumExchange('__IGNORE__')
        } else {
            toast('Selecione um modelo para aplicar.', { icon: '⚠️' })
        }
    }

    // --- Save Logic ---
    const persistAssignments = async (currentAssignments: Record<string, { construction: string, recruitment: string, scavenge: boolean, premiumExchange: boolean }>) => {
        const toastId = toast.loading('Salvando estratégias...')
        try {
            const updates = Object.entries(currentAssignments).map(async ([accId, strat]) => {
                const constrModel = constructionModels.find(m => m.uuid === strat.construction)
                const recrModel = recruitmentModels.find(m => m.uuid === strat.recruitment)

                if (strat.construction) {
                    await (window as any).ipcRenderer.invoke('accounts:update-strategy', {
                        accountId: accId,
                        type: 'construction',
                        config: {
                            active: true,
                            buildingOrder: constrModel?.buildingOrder || [],
                            templateUuid: strat.construction
                        }
                    })
                } else {
                    await (window as any).ipcRenderer.invoke('accounts:update-strategy', {
                        accountId: accId,
                        type: 'construction',
                        config: {
                            active: false,
                            buildingOrder: [],
                            templateUuid: ''
                        }
                    })
                }

                if (strat.recruitment) {
                    await (window as any).ipcRenderer.invoke('accounts:update-strategy', {
                        accountId: accId,
                        type: 'recruitment',
                        config: {
                            active: true,
                            units: recrModel?.units || {},
                            templateUuid: strat.recruitment
                        }
                    })
                } else {
                    await (window as any).ipcRenderer.invoke('accounts:update-strategy', {
                        accountId: accId,
                        type: 'recruitment',
                        config: {
                            active: false,
                            units: {},
                            templateUuid: ''
                        }
                    })
                }

                // Scavenge Update
                if (strat.scavenge) {
                    await (window as any).ipcRenderer.invoke('accounts:update-strategy', {
                        accountId: accId,
                        type: 'scavenge',
                        config: {
                            active: true
                        }
                    })
                } else {
                    await (window as any).ipcRenderer.invoke('accounts:update-strategy', {
                        accountId: accId,
                        type: 'scavenge',
                        config: {
                            active: false
                        }
                    })
                }

                // Premium Exchange Update
                if (strat.premiumExchange) {
                    await (window as any).ipcRenderer.invoke('accounts:update-strategy', {
                        accountId: accId,
                        type: 'premiumExchange',
                        config: {
                            active: true
                        }
                    })
                } else {
                    await (window as any).ipcRenderer.invoke('accounts:update-strategy', {
                        accountId: accId,
                        type: 'premiumExchange',
                        config: {
                            active: false
                        }
                    })
                }
            })

            await Promise.all(updates)
            toast.success('Estratégias salvas com sucesso!', { id: toastId })
            setInitialAssignments({ ...currentAssignments })
        } catch (err) {
            console.error('Error saving strategies:', err)
            toast.error('Erro ao salvar estratégias.', { id: toastId })
        }
    }

    const handleSave = () => persistAssignments(assignments)

    const hasChanges = JSON.stringify(assignments) !== JSON.stringify(initialAssignments)

    // --- Keyboard Shortcuts ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Save: Ctrl + S
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault()
                // Check if user is typing in inputs to avoid conflicting behavior? 
                // Actually Ctrl+S is usually global.
                if (hasChanges) {
                    handleSave()
                }
            }

            // Search: Ctrl + F
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault()
                const searchInput = document.getElementById('account-search')
                if (searchInput) searchInput.focus()
            }

            // Select All: Ctrl + A
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                // Only trigger if not already typing in an input (except search which is fine to select all results)
                const activeTag = document.activeElement?.tagName.toLowerCase()
                if (activeTag !== 'input' && activeTag !== 'textarea') {
                    e.preventDefault() // Only prevent if we are handling it
                    toggleSelectAll()
                }
            }

            // Clear Selection: Esc
            if (e.key === 'Escape') {
                e.preventDefault()
                setSelectedAccountIds([])
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [hasChanges, filteredAccounts, selectedAccountIds, assignments])


    if (loading) {
        return (
            <div className="flex bg-background h-screen justify-center items-center">
                <span className="text-zinc-500 font-medium animate-pulse">Carregando dados...</span>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col overflow-hidden animate-in fade-in duration-700 pb-0">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 pb-2">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                        <Layers className="w-8 h-8 text-emerald-500" />
                        Estratégias
                    </h1>
                    <p className="text-textMuted text-xs font-bold tracking-widest uppercase mt-1 ml-11">
                        Central de Comando • {accounts.length} Contas
                    </p>
                </div>

                <AnimatePresence>
                    {hasChanges && (
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onClick={handleSave}
                            className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2 uppercase tracking-wide text-xs group"
                        >
                            <Save className="w-4 h-4" />
                            Salvar Alterações
                            <span className="ml-1 px-1.5 py-0.5 bg-black/20 rounded text-[9px] font-mono opacity-60 group-hover:opacity-100 transition-opacity">Ctrl+S</span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 min-h-0 p-6 pt-2">
                {/* Sidebar Filters */}
                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Search */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            id="account-search"
                            type="text"
                            placeholder="Buscar conta..."
                            className="w-full bg-[#111113] border border-white/10 rounded-xl py-2.5 pl-9 pr-12 outline-none focus:border-emerald-500/50 text-white text-sm font-medium transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-zinc-600 border border-zinc-800 rounded px-1 min-w-[30px] text-center">Ctrl+F</span>
                    </div>

                    {/* Quick Filters */}
                    <div className="space-y-1">
                        <p className="px-2 text-[10px] font-black text-textMuted uppercase tracking-wider mb-2">Status</p>
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${filterStatus === 'all' ? 'bg-white/10 text-white' : 'text-textMuted hover:text-white hover:bg-white/5'}`}
                        >
                            <span>Todas</span>
                            <span className="bg-white/10 px-1.5 rounded text-[9px]">{accounts.length}</span>
                        </button>
                        <button
                            onClick={() => setFilterStatus('configured')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${filterStatus === 'configured' ? 'bg-emerald-500/10 text-emerald-500' : 'text-textMuted hover:text-white hover:bg-white/5'}`}
                        >
                            <span>Configuradas</span>
                        </button>
                        <button
                            onClick={() => setFilterStatus('pending')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${filterStatus === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'text-textMuted hover:text-white hover:bg-white/5'}`}
                        >
                            <span>Pendentes</span>
                        </button>
                    </div>

                    {/* Shortcuts Panel */}
                    <div className="space-y-2 mb-2">
                        <p className="px-2 text-[10px] font-black text-textMuted uppercase tracking-wider mb-2">Atalhos</p>
                        <button
                            onClick={() => navigateToTab('scripts')}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 hover:border-amber-500/50 hover:from-amber-500/20 transition-all group"
                        >
                            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-500 group-hover:scale-110 transition-transform">
                                <Hammer className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col items-start gap-0.5">
                                <span className="text-xs font-bold text-white uppercase tracking-tight">Novo Modelo</span>
                                <span className="text-[10px] text-textMuted group-hover:text-amber-200/70 transition-colors">Gerenciar Construção</span>
                            </div>
                            <ChevronRight className="w-3 h-3 text-textMuted ml-auto group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                        </button>

                        <button
                            onClick={() => navigateToTab('scripts')}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 hover:border-emerald-500/50 hover:from-emerald-500/20 transition-all group"
                        >
                            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-500 group-hover:scale-110 transition-transform">
                                <Users className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col items-start gap-0.5">
                                <span className="text-xs font-bold text-white uppercase tracking-tight">Novo Modelo</span>
                                <span className="text-[10px] text-textMuted group-hover:text-emerald-200/70 transition-colors">Gerenciar Unidades</span>
                            </div>
                            <ChevronRight className="w-3 h-3 text-textMuted ml-auto group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                        </button>
                    </div>

                    {/* Worlds Filter */}
                    <div className="space-y-1">
                        <p className="px-2 text-[10px] font-black text-textMuted uppercase tracking-wider mb-2 mt-2">Mundos</p>
                        <div className="grid grid-cols-2 gap-1.5">
                            <button
                                onClick={() => setFilterWorld('all')}
                                className={`px-2 py-2 rounded-lg border text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 ${filterWorld === 'all'
                                    ? 'bg-white/10 border-white/20 text-white'
                                    : 'bg-[#111111] border-white/5 text-textMuted hover:border-white/20'}`}
                            >
                                Todos
                            </button>
                            {uniqueWorlds.map(w => {
                                const info = formatWorld(w)
                                return (
                                    <button
                                        key={w}
                                        onClick={() => setFilterWorld(w)}
                                        className={`px-2 py-2 rounded-lg border text-[10px] font-bold uppercase transition-all flex items-center justify-start gap-2 overflow-hidden ${filterWorld === w
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                                            : 'bg-[#111111] border-white/5 text-textMuted hover:border-white/20'}`}
                                    >
                                        {info.flag && <img src={info.flag} className="w-4 h-3 rounded-[2px] object-cover opacity-80" />}
                                        <div className="flex flex-col items-start leading-none gap-0.5 min-w-0">
                                            <span className="truncate w-full text-[9px] opacity-70">{info.name}</span>
                                            <span className="truncate w-full">{info.prefix}</span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Bulk Actions Panel (Sidebar Version) */}
                    <div className="mt-6 pt-6 border-t border-white/5 disabled-group">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <p className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <Layers className="w-4 h-4 text-emerald-500" />
                                Ações em Massa
                            </p>
                            {selectedAccountIds.length > 0 && (
                                <span className="text-[10px] bg-emerald-500 text-black font-black px-2 py-0.5 rounded shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                                    {selectedAccountIds.length}
                                </span>
                            )}
                        </div>

                        <div className={`space-y-4 p-4 rounded-xl border transition-all ${selectedAccountIds.length > 0
                            ? 'bg-white/[0.03] border-white/10 opacity-100 pointer-events-auto'
                            : 'bg-transparent border-transparent opacity-50 pointer-events-none'
                            }`}>

                            <div className="space-y-1.5">
                                <label className="text-[10px] text-zinc-400 font-bold uppercase block tracking-wide">Construção</label>
                                <div className="relative">
                                    <CustomSelect
                                        value={bulkConstruction}
                                        onChange={(val) => setBulkConstruction(val)}
                                        options={[
                                            { label: 'Manter Atual', value: '__IGNORE__' },
                                            { label: 'Desativar', value: '' },
                                            ...constructionModels.map(m => ({ label: m.name, value: m.uuid }))
                                        ]}
                                        placeholder="Selecione..."
                                        icon={Hammer}
                                        borderColor="hover:border-emerald-500/30"
                                        color="text-emerald-500"
                                        disabled={selectedAccountIds.length === 0}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] text-zinc-400 font-bold uppercase block tracking-wide">Recrutamento</label>
                                <div className="relative">
                                    <CustomSelect
                                        value={bulkRecruitment}
                                        onChange={(val) => setBulkRecruitment(val)}
                                        options={[
                                            { label: 'Manter Atual', value: '__IGNORE__' },
                                            { label: 'Desativar', value: '' },
                                            ...recruitmentModels.map(m => ({ label: m.name, value: m.uuid }))
                                        ]}
                                        placeholder="Selecione..."
                                        icon={Users}
                                        borderColor="hover:border-orange-500/30"
                                        color="text-orange-500"
                                        disabled={selectedAccountIds.length === 0}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-zinc-400 font-bold uppercase block tracking-wide">Coleta</label>
                                    <CustomSelect
                                        value={bulkScavenge}
                                        onChange={(val) => setBulkScavenge(val)}
                                        options={[
                                            { label: '-', value: '__IGNORE__' },
                                            { label: 'On', value: 'true' },
                                            { label: 'Off', value: 'false' }
                                        ]}
                                        placeholder="-"
                                        borderColor="hover:border-indigo-500/30"
                                        color="text-indigo-500"
                                        disabled={selectedAccountIds.length === 0}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-zinc-400 font-bold uppercase block tracking-wide">Troca Premium</label>
                                    <CustomSelect
                                        value={bulkPremiumExchange}
                                        onChange={(val) => setBulkPremiumExchange(val)}
                                        options={[
                                            { label: '-', value: '__IGNORE__' },
                                            { label: 'On', value: 'true' },
                                            { label: 'Off', value: 'false' }
                                        ]}
                                        placeholder="-"
                                        borderColor="hover:border-amber-500/30"
                                        color="text-amber-500"
                                        disabled={selectedAccountIds.length === 0}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={applyBulk}
                                disabled={selectedAccountIds.length === 0}
                                className="w-full py-3 bg-white/5 hover:bg-emerald-500 text-white hover:text-black border border-white/5 hover:border-emerald-500 rounded-xl font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-lg hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                            >
                                Aplicar em {selectedAccountIds.length || 0}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="bg-[#111113] border border-white/5 rounded-2xl p-4 relative overflow-hidden shadow-2xl flex flex-col min-h-0">
                    {/* Header with Select All */}
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleSelectAll}
                                className="flex items-center gap-2 text-xs font-bold text-textMuted hover:text-white transition-colors group"
                            >
                                {selectedAccountIds.length === filteredAccounts.length && filteredAccounts.length > 0 ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                                ) : (
                                    <Square className="w-4 h-4" />
                                )}
                                Selecionar Tudo
                                {/* Hidden shortcut hint that appears on hover/focus could be nice too */}
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            {selectedAccountIds.length > 0 && (
                                <button
                                    onClick={() => setSelectedAccountIds([])}
                                    className="text-[10px] font-mono text-zinc-600 border border-zinc-800 rounded px-1.5 py-0.5 hover:text-white hover:border-zinc-600 transition-colors"
                                >
                                    ESC para limpar
                                </button>
                            )}
                            <span className="text-[10px] font-bold text-zinc-600 uppercase">
                                Mostrando {filteredAccounts.length} contas
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-2">
                        {filteredAccounts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-30">
                                <Filter className="w-16 h-16 stroke-[0.5] mb-4" />
                                <p className="font-bold text-lg tracking-tighter uppercase">Nenhuma conta encontrada</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3 pb-8">
                                {filteredAccounts.map((acc, idx) => (
                                    <motion.div
                                        key={acc._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.02 }}
                                        onClick={(e) => {
                                            if (!(e.target as HTMLElement).closest('select') && !(e.target as HTMLElement).closest('button')) {
                                                toggleSelect(acc._id)
                                            }
                                        }}
                                        className={`group relative bg-[#09090b] border rounded-xl transition-all duration-300 ${selectedAccountIds.includes(acc._id)
                                            ? 'border-emerald-500/50 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]'
                                            : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                                            }`}
                                    >
                                        <div className="p-4 space-y-4">
                                            {/* Header */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                                        {getServerInfo(acc).flagUrl ? (
                                                            <img src={getServerInfo(acc).flagUrl} className="w-full h-full object-cover rounded-lg opacity-80" />
                                                        ) : (
                                                            <span className="font-bold text-xs text-zinc-500">{getServerInfo(acc).sigla}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white text-sm truncate max-w-[150px]">{acc.name}</h3>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase">
                                                            <span className="bg-white/5 px-1.5 rounded">{acc.world}</span>
                                                            <span>{getServerInfo(acc).label}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`w-3 h-3 rounded-full border ${assignments[acc._id]?.construction || assignments[acc._id]?.recruitment
                                                    ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                                    : 'bg-transparent border-zinc-700'
                                                    }`} />
                                            </div>

                                            {/* Controls Grid */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Construction */}
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase">
                                                        <Hammer className="w-3 h-3" /> Construção
                                                    </div>
                                                    <div className="relative">
                                                        <CustomSelect
                                                            value={assignments[acc._id]?.construction || ''}
                                                            onChange={(val) => handleAssignmentChange(acc._id, 'construction', val)}
                                                            options={[
                                                                { label: 'Desativado', value: '' },
                                                                ...constructionModels.map(m => ({ label: m.name, value: m.uuid }))
                                                            ]}
                                                            placeholder="Desativado"
                                                            borderColor="hover:border-emerald-500/30"
                                                            color="text-emerald-500"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Recruitment */}
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase">
                                                        <Users className="w-3 h-3" /> Recrutamento
                                                    </div>
                                                    <div className="relative">
                                                        <CustomSelect
                                                            value={assignments[acc._id]?.recruitment || ''}
                                                            onChange={(val) => handleAssignmentChange(acc._id, 'recruitment', val)}
                                                            options={[
                                                                { label: 'Desativado', value: '' },
                                                                ...recruitmentModels.map(m => ({ label: m.name, value: m.uuid }))
                                                            ]}
                                                            placeholder="Desativado"
                                                            borderColor="hover:border-orange-500/30"
                                                            color="text-orange-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Toggles Row */}
                                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                                                <button
                                                    onClick={() => handleAssignmentChange(acc._id, 'scavenge', !assignments[acc._id]?.scavenge)}
                                                    className={`flex items-center justify-between p-2 rounded-lg border transition-all ${assignments[acc._id]?.scavenge
                                                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                                                        : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:bg-white/5'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <Package className="w-3.5 h-3.5" />
                                                        <span className="text-[10px] font-bold uppercase">Coleta</span>
                                                    </div>
                                                    <div className={`w-2 h-2 rounded-full ${assignments[acc._id]?.scavenge ? 'bg-indigo-500 shadow-glow' : 'bg-zinc-700'}`} />
                                                </button>

                                                <button
                                                    onClick={() => handleAssignmentChange(acc._id, 'premiumExchange', !assignments[acc._id]?.premiumExchange)}
                                                    className={`flex items-center justify-between p-2 rounded-lg border transition-all ${assignments[acc._id]?.premiumExchange
                                                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                                        : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:bg-white/5'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <RefreshCw className="w-3.5 h-3.5" />
                                                        <span className="text-[10px] font-bold uppercase">Troca Premium</span>
                                                    </div>
                                                    <div className={`w-2 h-2 rounded-full ${assignments[acc._id]?.premiumExchange ? 'bg-amber-500 shadow-glow' : 'bg-zinc-700'}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageModelsAccounts
