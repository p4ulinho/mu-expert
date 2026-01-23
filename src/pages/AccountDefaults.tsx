import React, { useState, useEffect, useCallback } from 'react'
import { Save, Server, Globe, Hammer, Users, Package, RefreshCw, Clock, Shield, Loader2, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { SERVER_DATA, getFlagAsset } from '../utils/servers'
import { CustomSelect } from '../components/ui/CustomSelect'

interface AccountDefaultsProps {
    user: any
    updateUser: (newUser: any) => void
}

const AccountDefaults: React.FC<AccountDefaultsProps> = ({ user, updateUser }) => {
    // Preferences state
    const [preferences, setPreferences] = useState({
        defaultServer: user?.preferences?.defaultServer || 'https://www.tribalwars.com.br',
        defaultWorld: user?.preferences?.defaultWorld || '',

        // Strategy Defaults
        defaultConstructionModel: user?.preferences?.defaultConstructionModel || '',
        defaultRecruitmentModel: user?.preferences?.defaultRecruitmentModel || '',
        defaultScavengeActive: user?.preferences?.defaultScavengeActive || false,
        defaultPremiumExchangeActive: user?.preferences?.defaultPremiumExchangeActive || false,

        // Browser Defaults
        closeBrowserOnFirstLogin: user?.preferences?.closeBrowserOnFirstLogin || false,
        closeBrowserOnCaptcha: user?.preferences?.closeBrowserOnCaptcha || false,

        // Automation Details
        defaultMinDelay: user?.preferences?.defaultMinDelay || 200,
        defaultMaxDelay: user?.preferences?.defaultMaxDelay || 500,

        // Network
        defaultProxyRotation: user?.preferences?.defaultProxyRotation || false,
    })

    const [availableWorlds, setAvailableWorlds] = useState<Record<string, string>>({})
    const [loadingWorlds, setLoadingWorlds] = useState(false)
    const [constructionModels, setConstructionModels] = useState<any[]>([])
    const [recruitmentModels, setRecruitmentModels] = useState<any[]>([])
    const [serverDropdownOpen, setServerDropdownOpen] = useState(false)

    const fetchData = useCallback(async () => {
        if (!user?.uuid) return
        try {
            const [constrResult, recrResult] = await Promise.all([
                (window as any).ipcRenderer.invoke('construction:get-models', user.uuid),
                (window as any).ipcRenderer.invoke('recruitment:get-models', user.uuid)
            ])
            setConstructionModels(constrResult?.models || [])
            setRecruitmentModels(recrResult?.models || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }, [user?.uuid])

    useEffect(() => {
        fetchData()
    }, [fetchData])


    // Server dropdown click outside and global exclusivity
    useEffect(() => {
        const handleGlobalClose = (e: any) => {
            if (e.detail?.id !== 'server-select') {
                setServerDropdownOpen(false)
            }
        }

        const handleClickOutside = (e: any) => {
            // We'll rely on global state or simpler check - actually for now just close if clicking outside
            // But since we removed the backdrop, we need to replicate 'click outside' logic?
            // The simplest way here is just: if we click anywhere and it's not inside this component
            // But 'this component' is the whole page. We need a ref for the dropdown container.
            // However, let's stick to the 'custom-select-open' logic for mutual exclusivity first.
            // For clicking outside, we usually need a Ref.
            // Let's rely on the fact that opening another one sends the event.
            // BUT, clicking blank space should also close it.
            // The user previously had a backdrop. I removed it. I MUST add a click listener to document OR rely on the backdrop I removed?
            // Actually, the previous step removed the backdrop from the JSX.
            // I should restore a lightweight click listener or just re-add the backdrop logic but WITHOUT blocking?
            // No, CustomSelect uses document listener.

            // Let's add the listener here.
            // We need a ref for the dropdown button/container.

        }

        window.addEventListener('custom-select-open', handleGlobalClose)
        return () => window.removeEventListener('custom-select-open', handleGlobalClose)
    }, [])

    const serverSelectRef = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (serverSelectRef.current && !serverSelectRef.current.contains(event.target as Node)) {
                setServerDropdownOpen(false)
            }
        }
        if (serverDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [serverDropdownOpen])

    // Sync preferences when user data updates
    useEffect(() => {
        if (user?.preferences) {
            setPreferences(prev => ({
                ...prev,
                ...user.preferences
            }))
        }
    }, [user])

    useEffect(() => {
        const fetchWorlds = async () => {
            if (!preferences.defaultServer) return
            setLoadingWorlds(true)
            try {
                const worlds = await (window as any).ipcRenderer.invoke('automation:get-servers', preferences.defaultServer)
                setAvailableWorlds(worlds || {})
            } catch (err) {
                console.error('Error fetching worlds:', err)
            } finally {
                setLoadingWorlds(false)
            }
        }
        fetchWorlds()
    }, [preferences.defaultServer])

    const handleSave = async () => {
        if (!user?.uuid) return
        const toastId = toast.loading('Salvando padrões...')
        try {
            const result = await (window as any).ipcRenderer.invoke('user:update-preferences', {
                uuid: user.uuid,
                preferences
            })
            if (result.success) {
                updateUser(result.user)
                toast.success('Padrões salvos com sucesso!', { id: toastId })
            } else {
                toast.error('Erro ao salvar: ' + (result.error || 'Desconhecido'), { id: toastId })
            }
        } catch (err) {
            toast.error('Erro de comunicação.', { id: toastId })
        }
    }

    const togglePref = (key: string) => {
        setPreferences(prev => ({ ...prev, [key]: !(prev as any)[key] }))
    }

    const SectionHeader = ({ icon: Icon, title, color = "text-white" }: { icon: any, title: string, color?: string }) => (
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
    )

    return (
        <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 px-1">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">
                        Padrões de <span className="text-emerald-500">Conta</span>
                    </h1>
                    <p className="text-zinc-400 font-medium text-sm max-w-2xl">
                        Defina o comportamento padrão para todas as contas.
                        Essas configurações serão aplicadas automaticamente ao adicionar novas contas.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className="btn-save-premium px-8 py-3 text-xs flex items-center gap-2 group cursor-pointer"
                >
                    <Save className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="font-bold uppercase tracking-wide">Salvar Definições</span>
                </button>
            </div>

            {/* Main Grid: 2 Columns */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* LEFT COLUMN: Settings & Navigation */}
                <div className="space-y-6">
                    {/* Server Defaults */}
                    <div className="glass p-6 rounded-3xl border border-white/5 relative group hover:border-emerald-500/20 transition-colors z-20">
                        <SectionHeader icon={Server} title="Mundo e Servidor Padrão" color="text-emerald-500" />
                        <p className="-mt-4 mb-6 text-xs text-zinc-500 font-medium">Aplicado automaticamente ao adicionar novas contas.</p>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wide text-zinc-500 ml-1">Servidor Preferido</label>
                                <div className={`relative ${serverDropdownOpen ? 'z-50' : 'z-30'}`} ref={serverSelectRef}>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            // Handle global close
                                            if (!serverDropdownOpen) {
                                                const event = new CustomEvent('custom-select-open', { detail: { id: 'server-select' } })
                                                window.dispatchEvent(event)
                                            }
                                            setServerDropdownOpen(!serverDropdownOpen)
                                        }}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 outline-none hover:border-emerald-500/30 text-white font-semibold flex items-center justify-between transition-all text-sm group-hover:bg-black/60 cursor-pointer text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            {Object.values(SERVER_DATA).find((s: any) => s.domain === preferences.defaultServer) && (
                                                <img
                                                    src={getFlagAsset(Object.values(SERVER_DATA).find((s: any) => s.domain === preferences.defaultServer)?.flag || '')}
                                                    alt="flag"
                                                    className="w-6 h-4 object-cover rounded shadow-sm"
                                                />
                                            )}
                                            <span>{Object.values(SERVER_DATA).find((s: any) => s.domain === preferences.defaultServer)?.name || preferences.defaultServer}</span>
                                        </div>
                                        <div className={`transition-transform duration-200 ${serverDropdownOpen ? 'rotate-180' : ''}`}>
                                            <Shield className="w-3 h-3 text-zinc-500" />
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {serverDropdownOpen && (
                                            <motion.div initial={{ opacity: 0, y: -5, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.95 }} className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1e] border border-white/10 rounded-xl shadow-2xl max-h-[300px] overflow-y-auto custom-scrollbar z-50 ring-1 ring-black/50">
                                                <div className="p-1">
                                                    {Object.values(SERVER_DATA).sort((a: any, b: any) => a.name.localeCompare(b.name)).map((data: any) => (
                                                        <button key={data.domain} type="button" onClick={() => { setPreferences({ ...preferences, defaultServer: data.domain }); setServerDropdownOpen(false) }} className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer rounded-lg ${preferences.defaultServer === data.domain ? 'bg-white/5 text-emerald-500' : 'text-zinc-300'}`}>
                                                            <img src={getFlagAsset(data.flag)} alt={data.flag} className="w-5 h-3.5 object-cover rounded shadow-sm" />
                                                            <span className="font-semibold text-xs">{data.name}</span>
                                                            {preferences.defaultServer === data.domain && <Check className="w-3 h-3 ml-auto animate-in fade-in" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {Object.keys(availableWorlds).length > 0 ? (
                                    <CustomSelect
                                        label="Mundo Automático"
                                        placeholder="Selecione o Mundo"
                                        value={preferences.defaultWorld}
                                        onChange={(val: any) => setPreferences({ ...preferences, defaultWorld: val })}
                                        options={Object.keys(availableWorlds).map(k => ({ label: k.toUpperCase(), value: k }))}
                                        borderColor="hover:border-emerald-500/30"
                                        color="text-emerald-500"
                                    />
                                ) : (
                                    <>
                                        <label className="text-[10px] font-bold uppercase tracking-wide text-zinc-500 ml-1">Mundo Automático</label>
                                        <div className="relative">
                                            {loadingWorlds ? (
                                                <div className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-zinc-500 text-sm font-semibold animate-pulse flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" /> Buscando mundos...
                                                </div>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={preferences.defaultWorld}
                                                    onChange={(e) => setPreferences({ ...preferences, defaultWorld: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 outline-none focus:border-emerald-500/50 text-white font-semibold text-sm placeholder-zinc-700"
                                                    placeholder="Ex: br130"
                                                />
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* Network & Browser */}
                    <div className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-purple-500/20 transition-colors">
                        <SectionHeader icon={Globe} title="Configurações do Navegador" color="text-purple-500" />

                        <div className="space-y-3">
                            <button
                                onClick={() => togglePref('closeBrowserOnFirstLogin')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${preferences.closeBrowserOnFirstLogin ? 'bg-purple-500/10 border-purple-500/30' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                            >
                                <span className={`text-xs font-bold uppercase tracking-wide ${preferences.closeBrowserOnFirstLogin ? 'text-purple-300' : 'text-zinc-400'}`}>Fechar após 1º Login</span>
                                <div className={`w-8 h-4 rounded-full relative transition-colors ${preferences.closeBrowserOnFirstLogin ? 'bg-purple-500' : 'bg-zinc-800'}`}>
                                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${preferences.closeBrowserOnFirstLogin ? 'left-4.5' : 'left-0.5'}`} />
                                </div>
                            </button>

                            <button
                                onClick={() => togglePref('closeBrowserOnCaptcha')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${preferences.closeBrowserOnCaptcha ? 'bg-purple-500/10 border-purple-500/30' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                            >
                                <span className={`text-xs font-bold uppercase tracking-wide ${preferences.closeBrowserOnCaptcha ? 'text-purple-300' : 'text-zinc-400'}`}>Fechar Conta Após Resolver Captcha</span>
                                <div className={`w-8 h-4 rounded-full relative transition-colors ${preferences.closeBrowserOnCaptcha ? 'bg-purple-500' : 'bg-zinc-800'}`}>
                                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${preferences.closeBrowserOnCaptcha ? 'left-4.5' : 'left-0.5'}`} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Scripts & Automation (Merged) */}
                <div className="space-y-6">
                    <div className="glass p-6 rounded-3xl border border-white/5 relative h-full group hover:border-amber-500/20 transition-colors">
                        <SectionHeader icon={Hammer} title="Scripts & Automação" color="text-amber-500" />

                        <div className="space-y-6">

                            {/* Custom Select Construction */}
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                <CustomSelect
                                    label="Construção Automática"
                                    icon={Hammer}
                                    value={preferences.defaultConstructionModel}
                                    onChange={(val: any) => setPreferences({ ...preferences, defaultConstructionModel: val })}
                                    options={constructionModels.map(m => ({ label: m.name, value: m.uuid }))}
                                    placeholder="Nenhum Modelo Selecionado"
                                />
                            </div>

                            {/* Custom Select Recruitment */}
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                <CustomSelect
                                    label="Recrutamento de Unidades"
                                    icon={Users}
                                    value={preferences.defaultRecruitmentModel}
                                    onChange={(val: any) => setPreferences({ ...preferences, defaultRecruitmentModel: val })}
                                    options={recruitmentModels.map(m => ({ label: m.name, value: m.uuid }))}
                                    placeholder="Nenhum Modelo Selecionado"
                                />
                            </div>

                            <div className="border-t border-white/5 my-4" />

                            {/* Toggles (Scavenge/PP) */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => togglePref('defaultScavengeActive')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 gap-2 cursor-pointer ${preferences.defaultScavengeActive ? 'bg-amber-500/10 border-amber-500/30 shadow-[inset_0_0_20px_rgba(245,158,11,0.1)]' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                                >
                                    <Package className={`w-6 h-6 ${preferences.defaultScavengeActive ? 'text-amber-400' : 'text-zinc-600'}`} />
                                    <span className={`text-[10px] font-bold uppercase tracking-wide ${preferences.defaultScavengeActive ? 'text-amber-200' : 'text-zinc-500'}`}>Coleta</span>
                                    <div className={`w-12 h-1 rounded-full ${preferences.defaultScavengeActive ? 'bg-amber-500' : 'bg-zinc-800'}`} />
                                </button>

                                <button
                                    onClick={() => togglePref('defaultPremiumExchangeActive')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 gap-2 cursor-pointer ${preferences.defaultPremiumExchangeActive ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                                >
                                    <RefreshCw className={`w-6 h-6 ${preferences.defaultPremiumExchangeActive ? 'text-emerald-400' : 'text-zinc-600'}`} />
                                    <span className={`text-[10px] font-bold uppercase tracking-wide ${preferences.defaultPremiumExchangeActive ? 'text-emerald-200' : 'text-zinc-500'}`}>Troca Premium</span>
                                    <div className={`w-12 h-1 rounded-full ${preferences.defaultPremiumExchangeActive ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
                                </button>
                            </div>

                            {/* Delays Input */}
                            <div className="pt-2">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">Delay Aleatório (ms)</label>
                                    <Clock className="w-3 h-3 text-zinc-600" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={preferences.defaultMinDelay}
                                        onChange={(e) => setPreferences({ ...preferences, defaultMinDelay: Number(e.target.value) })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-center text-white text-sm font-semibold outline-none focus:border-amber-500/50"
                                        placeholder="Min"
                                    />
                                    <span className="text-zinc-600 font-bold">-</span>
                                    <input
                                        type="number"
                                        value={preferences.defaultMaxDelay}
                                        onChange={(e) => setPreferences({ ...preferences, defaultMaxDelay: Number(e.target.value) })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-center text-white text-sm font-semibold outline-none focus:border-amber-500/50"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AccountDefaults
