import React, { useState, useEffect } from 'react'
import {
    Globe,
    Loader2,
    Plus,
    Trash2,
    Shield,
    Zap,
    ChevronRight,
    User,
    Save,
    CreditCard,
    ShoppingCart
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import ConfirmationModal from '../components/ConfirmationModal'

interface Proxy {
    _id: string
    address: string
    ownerUuid: string
    isForSale?: boolean
    price?: number
}

interface ProxiesProps {
    userUuid: string
}

const Proxies: React.FC<ProxiesProps> = ({ userUuid }) => {
    const [proxies, setProxies] = useState<Proxy[]>([])
    const [proxyInput, setProxyInput] = useState('')

    // Individual Add Fields
    const [indIp, setIndIp] = useState('')
    const [indPort, setIndPort] = useState('')
    const [indUser, setIndUser] = useState('')
    const [indPass, setIndPass] = useState('')

    const [isSaving, setIsSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('meus')

    // Stock for buying
    const [stockProxies, setStockProxies] = useState<any[]>([])
    const [stockLoading, setStockLoading] = useState(false)
    const [buyQuantity, setBuyQuantity] = useState(5)
    const [unitPrice, setUnitPrice] = useState(0.60)

    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant: 'danger' | 'success' | 'info';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        variant: 'danger'
    })

    useEffect(() => {
        if (userUuid) {
            fetchProxies()
        }
    }, [userUuid])

    const fetchProxies = async () => {
        setLoading(true)
        try {
            const results = await (window as any).ipcRenderer.invoke('proxies:get', userUuid)
            setProxies(results)
        } catch (error) {
            console.error('Error fetching proxies:', error)
            toast.error('Erro ao buscar proxies.')
        } finally {
            setLoading(false)
        }
    }

    const fetchStock = async () => {
        setStockLoading(true)
        try {
            const results = await (window as any).ipcRenderer.invoke('proxies:get-stock')
            setStockProxies(results)
            if (results.length > 0) {
                setUnitPrice(results[0].price || 0.60)
            }
        } catch (error) {
            console.error('Error fetching stock:', error)
        } finally {
            setStockLoading(false)
        }
    }

    useEffect(() => {
        if (activeTab === 'comprar_proxies') {
            fetchStock()
        }
    }, [activeTab])

    const handleBuyProxy = async () => {
        const toastId = toast.loading('Iniciando compra...')
        try {
            const result = await (window as any).ipcRenderer.invoke('payments:create', {
                userUuid,
                items: [{
                    id: 'GENERIC_PROXY',
                    title: 'Proxy Residencial Premium',
                    unit_price: unitPrice,
                    quantity: buyQuantity,
                    description: `Pacote de ${buyQuantity} Proxies Residenciais`
                }]
            })
            if (result.success) {
                toast.success('Redirecionando...', { id: toastId })
            } else {
                toast.error(result.error || 'Erro ao criar preferência.', { id: toastId })
            }
        } catch (error: any) {
            toast.error('Erro: ' + error.message, { id: toastId })
        }
    }

    const handleSaveProxies = async () => {
        let addresses: string[] = []

        if (proxyInput.trim()) {
            addresses = proxyInput.split('\n').map(p => p.trim()).filter(p => p !== '')
        } else if (indIp && indPort) {
            let addr = `${indIp}:${indPort}`
            if (indUser && indPass) {
                addr += `:${indUser}:${indPass}`
            } else if (indUser) {
                addr += `:${indUser}`
            }
            addresses = [addr]
        }

        if (addresses.length === 0) {
            toast.error('Informe ao menos um proxy.')
            return
        }

        setIsSaving(true)
        try {
            const result = await (window as any).ipcRenderer.invoke('proxies:add', {
                userUuid,
                proxies: addresses.map(addr => ({ address: addr }))
            })
            if (result.success) {
                toast.success(`${addresses.length} proxies salvos com sucesso!`)
                setProxyInput('')
                setIndIp('')
                setIndPort('')
                setIndUser('')
                setIndPass('')
                fetchProxies()
            } else {
                toast.error('Erro ao salvar proxies.')
            }
        } catch (error) {
            console.error('Error saving proxies:', error)
            toast.error('Falha na comunicação com o sistema.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteProxy = async (id: string) => {
        setConfirmState({
            isOpen: true,
            title: 'Remover Proxy',
            message: 'Tem certeza que deseja remover este proxy? Esta ação também o removerá de qualquer conta vinculada.',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    const result = await (window as any).ipcRenderer.invoke('proxies:delete', id)
                    if (result.success) {
                        toast.success('Proxy removido.')
                        fetchProxies()
                    } else {
                        toast.error('Erro ao excluir proxy.')
                    }
                } catch (error) {
                    console.error('Error deleting proxy:', error)
                    toast.error('Falha ao excluir proxy.')
                }
            }
        })
    }

    const handleDeleteAll = async () => {
        setConfirmState({
            isOpen: true,
            title: 'Remover TODOS os Proxies',
            message: 'Tem certeza que deseja remover TODOS os seus proxies? Esta ação também removerá os proxies de TODAS as suas contas.',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    const result = await (window as any).ipcRenderer.invoke('proxies:delete-all', userUuid)
                    if (result.success) {
                        toast.success('Todos os proxies foram removidos.')
                        fetchProxies()
                    } else {
                        toast.error('Erro ao remover proxies.')
                    }
                } catch (error) {
                    console.error('Error deleting proxies:', error)
                    toast.error('Falha ao excluir proxies.')
                }
            }
        })
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white uppercase flex items-center gap-3">
                    <ShoppingCart className="w-8 h-8 text-indigo-500" />
                    RECURSOS & LOJA
                </h1>
                <p className="text-zinc-500 text-sm font-bold mt-1">
                    Gerencie seus proxies e mantenha suas conexões seguras e rápidas.
                </p>
            </div>

            <div className="grid grid-cols-[300px_1fr] gap-8 items-start">
                {/* Sidebar */}
                <div className="space-y-2">
                    <button
                        onClick={() => setActiveTab('meus')}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${activeTab === 'meus'
                            ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400'
                            : 'bg-[#18181b] border-white/5 text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${activeTab === 'meus' ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
                                <Globe className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <span className="block text-xs font-black uppercase tracking-wider">Meus Proxies</span>
                                <span className="block text-[10px] opacity-70">Gerencie sua lista de IPs</span>
                            </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'meus' ? 'rotate-90' : ''}`} />
                    </button>

                    <button
                        onClick={() => setActiveTab('comprar_proxies')}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${activeTab === 'comprar_proxies'
                            ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                            : 'bg-[#18181b] border-white/5 text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${activeTab === 'comprar_proxies' ? 'bg-amber-500/20' : 'bg-white/5'}`}>
                                <Zap className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <span className="block text-xs font-black uppercase tracking-wider">Comprar Proxies</span>
                                <span className="block text-[10px] opacity-70">Adquira novos IPs</span>
                            </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'comprar_proxies' ? 'rotate-90' : ''}`} />
                    </button>

                    <button
                        onClick={() => setActiveTab('comprar_contas')}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${activeTab === 'comprar_contas'
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                            : 'bg-[#18181b] border-white/5 text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${activeTab === 'comprar_contas' ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                                <User className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <span className="block text-xs font-black uppercase tracking-wider">Comprar Contas</span>
                                <span className="block text-[10px] opacity-70">Contas prontas para uso</span>
                            </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'comprar_contas' ? 'rotate-90' : ''}`} />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    {activeTab === 'meus' && (
                        <>
                            {/* Add Proxies Panel */}
                            <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h2 className="flex items-center gap-2 text-xl font-bold text-white uppercase mb-8">
                                        <Plus className="w-6 h-6 text-emerald-500" />
                                        Adicionar Proxies
                                    </h2>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Adicionar em Massa</label>
                                                <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                                                    IP:PORTA:USER:PASS
                                                </span>
                                            </div>
                                            <textarea
                                                value={proxyInput}
                                                onChange={(e) => setProxyInput(e.target.value)}
                                                spellCheck={false}
                                                placeholder="127.0.0.1:8888&#10;192.168.1.1:3128:usuario:senha"
                                                className="w-full h-48 bg-[#0a0a0a] border border-white/5 rounded-xl p-4 text-xs font-mono text-zinc-300 placeholder:text-zinc-700 outline-none focus:border-indigo-500/50 resize-none transition-colors"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Adicionar Individual</label>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-zinc-600 uppercase">Endereço IP</label>
                                                    <input
                                                        type="text"
                                                        value={indIp}
                                                        onChange={(e) => setIndIp(e.target.value)}
                                                        placeholder="Ex: 1.1.1.1"
                                                        className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg py-3 px-4 text-xs text-white outline-none focus:border-indigo-500/50 transition-colors"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-zinc-600 uppercase">Porta</label>
                                                    <input
                                                        type="text"
                                                        value={indPort}
                                                        onChange={(e) => setIndPort(e.target.value)}
                                                        placeholder="8080"
                                                        className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg py-3 px-4 text-xs text-white outline-none focus:border-indigo-500/50 transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-zinc-600 uppercase">Usuário (Opcional)</label>
                                                    <input
                                                        type="text"
                                                        value={indUser}
                                                        onChange={(e) => setIndUser(e.target.value)}
                                                        placeholder="admin"
                                                        className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg py-3 px-4 text-xs text-white outline-none focus:border-indigo-500/50 transition-colors"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-zinc-600 uppercase">Senha (Opcional)</label>
                                                    <input
                                                        type="password"
                                                        value={indPass}
                                                        onChange={(e) => setIndPass(e.target.value)}
                                                        placeholder="••••••••"
                                                        className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg py-3 px-4 text-xs text-white outline-none focus:border-indigo-500/50 transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleSaveProxies}
                                                disabled={isSaving}
                                                className="w-full mt-4 flex items-center justify-center gap-3 py-4 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSaving ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <Save className="w-5 h-5" />
                                                )}
                                                {isSaving ? 'Salvando...' : 'Salvar Proxies'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* List */}
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <Globe className="w-6 h-6 text-indigo-500" />
                                    <h2 className="text-xl font-bold text-white uppercase flex items-center gap-3">
                                        Meus Proxies
                                        <span className="px-2 py-0.5 rounded-md bg-[#18181b] border border-white/10 text-[10px] text-zinc-400">
                                            TOTAL: {proxies.length}
                                        </span>
                                    </h2>
                                    {proxies.length > 0 && (
                                        <button
                                            onClick={handleDeleteAll}
                                            className="ml-auto flex items-center gap-2 text-[10px] font-bold text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> LIMPAR TUDO
                                        </button>
                                    )}
                                </div>

                                {loading ? (
                                    <div className="py-32 border border-white/5 rounded-3xl border-dashed flex flex-col items-center justify-center opacity-50">
                                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Carregando...</span>
                                    </div>
                                ) : proxies.length === 0 ? (
                                    <div className="py-32 border border-white/5 rounded-3xl border-dashed flex flex-col items-center justify-center opacity-30 gap-6">
                                        <Globe className="w-20 h-20 stroke-1" />
                                        <div className="text-center space-y-1">
                                            <p className="text-sm font-bold uppercase tracking-widest">Nenhum proxy disponível</p>
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Adicione acima para começar</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <AnimatePresence mode='popLayout'>
                                            {proxies.map(p => (
                                                <motion.div
                                                    key={p._id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="bg-[#111111] border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                                                            <Shield className="w-5 h-5 text-indigo-500" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-zinc-200 truncate font-mono">{p.address.split(':')[0]}:{p.address.split(':')[1]}</p>
                                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider truncate">
                                                                {p.address.split(':')[2] ? `USER: ${p.address.split(':')[2]}` : 'Sem Autenticação'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteProxy(p._id)}
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-zinc-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === 'comprar_proxies' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                            {/* Compact Feature Banner */}
                            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-500 shrink-0">
                                    <Zap size={24} />
                                </div>
                                <div className="flex-1 text-center md:text-left space-y-1">
                                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">Proxies Premium Residenciais</h3>
                                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-none">Alta velocidade & Máxima segurança em todo o mundo</p>
                                </div>
                                <div className="flex items-center gap-4 bg-[#0a0a0a]/50 p-2 rounded-xl border border-white/5">
                                    <div className="px-3 text-center">
                                        <p className="text-[9px] font-black text-zinc-500 uppercase">Preço Unitário</p>
                                        <p className="text-sm font-black text-white">R$ {unitPrice.toFixed(2).replace('.', ',')}</p>
                                    </div>
                                    <div className="w-px h-8 bg-white/10" />
                                    <div className="px-3 text-center">
                                        <p className="text-[9px] font-black text-zinc-500 uppercase">Estoque</p>
                                        <p className="text-sm font-black text-amber-500">{stockProxies.length}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Purchase Action Row */}
                            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
                                {stockLoading ? (
                                    <div className="py-10 flex flex-col items-center justify-center opacity-50">
                                        <Loader2 className="w-8 h-8 animate-spin mb-3 text-amber-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Consultando estoque...</span>
                                    </div>
                                ) : stockProxies.length === 0 ? (
                                    <div className="py-10 text-center opacity-30">
                                        <Globe className="w-12 h-12 mx-auto mb-3 stroke-1" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nenhum proxy disponível no momento</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-8">
                                        {/* Quantity Selector */}
                                        <div className="w-full md:w-64 lg:w-72 space-y-3">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex justify-between">
                                                Quantidade
                                                <span className="text-amber-500/70">{buyQuantity} unidades</span>
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setBuyQuantity(Math.max(1, buyQuantity - 1))}
                                                    className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white font-bold transition-all shrink-0 active:scale-90"
                                                >-</button>
                                                <input
                                                    type="number"
                                                    value={buyQuantity}
                                                    onChange={(e) => setBuyQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                    className="flex-1 min-w-0 h-12 bg-[#0a0a0a] border border-amber-500/30 rounded-xl text-center text-white font-black outline-none focus:border-amber-500 transition-all text-lg"
                                                />
                                                <button
                                                    onClick={() => setBuyQuantity(Math.min(stockProxies.length, buyQuantity + 1))}
                                                    className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white font-bold transition-all shrink-0 active:scale-90"
                                                >+</button>
                                            </div>
                                        </div>

                                        {/* Total & Button */}
                                        <div className="flex-1 w-full flex flex-col sm:flex-row items-center gap-6 pt-6 md:pt-0 md:border-l border-white/5 md:pl-8">
                                            <div className="text-center sm:text-left">
                                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-tight">Total do Pedido</p>
                                                <p className="text-3xl lg:text-4xl font-black text-white whitespace-nowrap">R$ {(buyQuantity * unitPrice).toFixed(2).replace('.', ',')}</p>
                                            </div>

                                            <button
                                                onClick={handleBuyProxy}
                                                className="flex-1 w-full py-5 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-amber-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer group"
                                            >
                                                <CreditCard size={18} className="group-hover:scale-110 transition-transform" />
                                                Pagar Agora
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 justify-center opacity-30">
                                <Shield size={12} />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Processamento Seguro via Mercado Pago • Entrega Imediata</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'comprar_contas' && (
                        <div className="py-40 text-center opacity-30 animate-in fade-in duration-300">
                            <User size={60} className="mx-auto mb-6" />
                            <h2 className="text-xl font-black uppercase tracking-widest">Próximamente</h2>
                            <p className="text-sm font-bold mt-2">Estamos preparando as melhores contas para você.</p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmState.onConfirm}
                title={confirmState.title}
                message={confirmState.message}
                variant={confirmState.variant}
            />
        </div>
    )
}

export default Proxies
