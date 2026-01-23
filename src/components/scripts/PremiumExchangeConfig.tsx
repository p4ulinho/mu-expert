import React, { useEffect, useState } from 'react';
import { Save, ShoppingCart, TrendingUp, RefreshCw, AlertCircle, ArrowUpDown, Zap, Boxes } from 'lucide-react';
import { ScriptSettingsCard } from './shared/ScriptSettingsCard';
import { toast } from 'react-hot-toast';

// Load local assets
const buildingAssets = import.meta.glob('../../assets/buildings/*.webp', { eager: true, query: '?url', import: 'default' });
const getBuildingAsset = (name: string) => {
    const path = `../../assets/buildings/${name}.webp`;
    return (buildingAssets[path] as string) || '';
};

const RESOURCE_IMAGES = {
    wood: getBuildingAsset('wood'),
    stone: getBuildingAsset('stone'),
    iron: getBuildingAsset('iron'),
};

interface PremiumExchangeConfigProps {
    user: any
    updateUser: (user: any) => void
}

const PremiumExchangeConfig: React.FC<PremiumExchangeConfigProps> = ({ user, updateUser }) => {
    const [config, setConfig] = useState({
        active: false,
        buyMode: false,
        sellMode: false,
        refreshRate: 10000,
        buyPriority: 'auto',
        sellPriority: 'auto',
        buy: {
            wood: 60,
            clay: 60,
            iron: 60,
            perTime: 1000,
            warehouseLimit: 100000,
            minStock: 1,
            enableWood: true,
            enableClay: true,
            enableIron: true,
        },
        sell: {
            wood: 800,
            clay: 800,
            iron: 800,
            reserveWood: 0,
            reserveClay: 0,
            reserveIron: 0,
            limit: 1000,
            enableWood: true,
            enableClay: true,
            enableIron: true,
            progressive: false,
        },
    });

    useEffect(() => {
        if (user?.globalSettings?.premiumExchange) {
            console.log('CARREGANDO CONFIG (PremiumExchange) DO USUARIO:', user.globalSettings.premiumExchange);
            setConfig(prev => ({ ...prev, ...user.globalSettings.premiumExchange }));
        } else {
            const saved = localStorage.getItem('premium_exchange_config');
            if (saved) {
                try {
                    setConfig((prev) => ({ ...prev, ...JSON.parse(saved) }));
                } catch (e) {
                    console.error('Failed to parse premium exchange config', e);
                }
            }
        }
    }, [user]);

    const handleSave = async () => {
        localStorage.setItem('premium_exchange_config', JSON.stringify(config));

        const payload = {
            userUuid: user.uuid,
            settings: {
                premiumExchange: config
            }
        };

        console.log('ENVIANDO DADOS (PremiumExchange):', payload);

        try {
            const result = await (window as any).ipcRenderer.invoke('premiumExchange:save-settings', payload);

            console.log('RETORNO DA API (PremiumExchange):', result);

            if (result.success) {
                if (result.user) updateUser(result.user);
                toast.success('Configuração de Troca Premium Salva no Servidor!');
            } else {
                toast.error('Erro ao salvar no servidor: ' + result.error);
            }
        } catch (err: any) {
            console.error('ERRO AO SALVAR:', err);
            toast.error('Erro de conexão ao salvar: ' + err.message);
        }
    };

    const updateBuyValue = (field: string, value: string) => {
        const num = parseInt(value) || 0;
        setConfig((prev: any) => ({
            ...prev,
            buy: { ...prev.buy, [field]: num },
        }));
    };

    const updateSellValue = (field: string, value: string) => {
        const num = parseInt(value) || 0;
        setConfig((prev: any) => ({
            ...prev,
            sell: { ...prev.sell, [field]: num },
        }));
    };

    const toggleBuyEnable = (resource: string) => {
        const field = `enable${resource.charAt(0).toUpperCase() + resource.slice(1)}`;
        setConfig((prev: any) => ({
            ...prev,
            buy: { ...prev.buy, [field]: !prev.buy[field] },
        }));
    };

    const toggleSellEnable = (resource: string) => {
        const field = `enable${resource.charAt(0).toUpperCase() + resource.slice(1)}`;
        setConfig((prev: any) => ({
            ...prev,
            sell: { ...prev.sell, [field]: !prev.sell[field] },
        }));
    };

    return (
        <div className="flex flex-col gap-6 w-full pb-20">
            {/* Header Card */}
            <div className="bg-[#18181b] rounded-3xl p-6 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex items-center gap-5 w-full">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-600/20 shadow-[0_0_30px_rgba(79,70,229,0.1)] shrink-0">
                        <RefreshCw className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Troca Premium</h1>
                        <p className="text-zinc-400 text-sm font-medium">Automatize a compra e venda de recursos por Pontos Premium.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* BUY SETTINGS */}
                <ScriptSettingsCard
                    title="Configurações de Compra"
                    description="Defina os preços máximos e limites para compra."
                >
                    <div className="space-y-6">
                        <div className={`flex items-center justify-between bg-[#09090b] p-4 rounded-2xl border transition-all duration-300 ${config.buyMode ? 'border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-white/5'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${config.buyMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
                                    <ShoppingCart className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-white block">Ativar Modo Compra</span>
                                    <span className="text-[10px] text-zinc-500 font-medium">Comprar recursos quando barato</span>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.buyMode}
                                    onChange={(e) => setConfig((prev: any) => ({ ...prev, buyMode: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['wood', 'clay', 'iron'].map((res) => (
                                <div key={`buy-${res}`} className={`bg-[#09090b] p-4 rounded-2xl border transition-all duration-300 group ${config.buyMode ? 'border-white/5 hover:border-white/10' : 'opacity-50 grayscale pointer-events-none border-white/5'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <img src={(RESOURCE_IMAGES as any)[res === 'clay' ? 'stone' : res]} alt={res} className="w-6 h-6 object-contain" />
                                            <span className="text-xs font-bold text-zinc-400 uppercase">{res === 'clay' ? 'Argila' : res === 'wood' ? 'Madeira' : 'Ferro'}</span>
                                        </div>
                                        <button
                                            onClick={() => toggleBuyEnable(res)}
                                            className={`relative inline-flex items-center cursor-pointer ${(config.buy as any)[`enable${res.charAt(0).toUpperCase() + res.slice(1)}`] ? 'opacity-100' : 'opacity-50'}`}
                                        >
                                            <div className={`w-8 h-4 rounded-full transition-colors ${(config.buy as any)[`enable${res.charAt(0).toUpperCase() + res.slice(1)}`] ? 'bg-emerald-500' : 'bg-zinc-700'}`}></div>
                                            <div className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform ${(config.buy as any)[`enable${res.charAt(0).toUpperCase() + res.slice(1)}`] ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </button>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Preço Máx.</label>
                                        <input
                                            type="number"
                                            value={(config.buy as any)[res]}
                                            onChange={(e) => updateBuyValue(res, e.target.value)}
                                            className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-white text-sm font-bold outline-none focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${config.buyMode ? '' : 'opacity-50 grayscale pointer-events-none'}`}>
                            <div className="bg-[#09090b] p-4 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    <label className="text-xs font-bold text-zinc-400">Máx. por Vez</label>
                                </div>
                                <input
                                    type="number"
                                    value={config.buy.perTime}
                                    onChange={(e) => updateBuyValue('perTime', e.target.value)}
                                    className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-white text-sm font-bold outline-none focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <div className="bg-[#09090b] p-4 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Boxes className="w-4 h-4 text-blue-500" />
                                    <label className="text-xs font-bold text-zinc-400">Limite Armazém</label>
                                </div>
                                <input
                                    type="number"
                                    value={config.buy.warehouseLimit}
                                    onChange={(e) => updateBuyValue('warehouseLimit', e.target.value)}
                                    className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-white text-sm font-bold outline-none focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </ScriptSettingsCard>

                {/* SELL SETTINGS */}
                <ScriptSettingsCard
                    title="Configurações de Venda"
                    description="Defina os preços mínimos e reservas para venda."
                >
                    <div className="space-y-6">
                        <div className={`flex items-center justify-between bg-[#09090b] p-4 rounded-2xl border transition-all duration-300 ${config.sellMode ? 'border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-white/5'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${config.sellMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-white block">Ativar Modo Venda</span>
                                    <span className="text-[10px] text-zinc-500 font-medium">Vender recursos quando caro</span>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.sellMode}
                                    onChange={(e) => setConfig((prev: any) => ({ ...prev, sellMode: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['wood', 'clay', 'iron'].map((res) => (
                                <div key={`sell-${res}`} className={`bg-[#09090b] p-4 rounded-2xl border transition-all duration-300 group ${config.sellMode ? 'border-white/5 hover:border-white/10' : 'opacity-50 grayscale pointer-events-none border-white/5'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <img src={(RESOURCE_IMAGES as any)[res === 'clay' ? 'stone' : res]} alt={res} className="w-6 h-6 object-contain" />
                                            <span className="text-xs font-bold text-zinc-400 uppercase">{res === 'clay' ? 'Argila' : res === 'wood' ? 'Madeira' : 'Ferro'}</span>
                                        </div>
                                        <button
                                            onClick={() => toggleSellEnable(res)}
                                            className={`relative inline-flex items-center cursor-pointer ${(config.sell as any)[`enable${res.charAt(0).toUpperCase() + res.slice(1)}`] ? 'opacity-100' : 'opacity-50'}`}
                                        >
                                            <div className={`w-8 h-4 rounded-full transition-colors ${(config.sell as any)[`enable${res.charAt(0).toUpperCase() + res.slice(1)}`] ? 'bg-orange-500' : 'bg-zinc-700'}`}></div>
                                            <div className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform ${(config.sell as any)[`enable${res.charAt(0).toUpperCase() + res.slice(1)}`] ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-500 block mb-1 uppercase">Preço Mín.</label>
                                            <input
                                                type="number"
                                                value={(config.sell as any)[res]}
                                                onChange={(e) => updateSellValue(res, e.target.value)}
                                                className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-white text-sm font-bold outline-none focus:border-orange-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-500 block mb-1 uppercase">Reserva</label>
                                            <input
                                                type="number"
                                                value={(config.sell as any)[`reserve${res.charAt(0).toUpperCase() + res.slice(1)}`]}
                                                onChange={(e) => updateSellValue(`reserve${res.charAt(0).toUpperCase() + res.slice(1)}`, e.target.value)}
                                                className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-white text-sm font-bold outline-none focus:border-orange-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${config.sellMode ? '' : 'opacity-50 grayscale pointer-events-none'}`}>
                            <div className="bg-[#09090b] p-4 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <ArrowUpDown className="w-4 h-4 text-indigo-500" />
                                        <label className="text-xs font-bold text-zinc-400">Venda Progressiva</label>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={config.sell.progressive}
                                            onChange={(e) => setConfig({ ...config, sell: { ...config.sell, progressive: e.target.checked } })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                                <p className="text-[10px] text-zinc-500 leading-tight">Aumenta a oferta gradualmente conforme o estoque.</p>
                            </div>
                            <div className="bg-[#09090b] p-4 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    <label className="text-xs font-bold text-zinc-400">Limite por Venda</label>
                                </div>
                                <input
                                    type="number"
                                    value={config.sell.limit}
                                    onChange={(e) => updateSellValue('limit', e.target.value)}
                                    className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-white text-sm font-bold outline-none focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </ScriptSettingsCard>
            </div>

            <div className="bg-[#111113] rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <AlertCircle className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Taxa de Verificação</h4>
                        <p className="text-xs text-zinc-500 mt-1">Tempo entre verificações do mercado (ms). Padrão: 10000 (10s).</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <input
                        type="number"
                        value={config.refreshRate}
                        onChange={(e) => setConfig({ ...config, refreshRate: parseInt(e.target.value) || 10000 })}
                        className="bg-[#18181b] border border-white/10 rounded-xl py-3 px-6 text-white text-sm font-bold outline-none focus:border-indigo-500 w-full md:w-32 text-center"
                    />
                    <button
                        onClick={handleSave}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-wider px-8 py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" /> SALVAR CONFIGURAÇÕES
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PremiumExchangeConfig;
