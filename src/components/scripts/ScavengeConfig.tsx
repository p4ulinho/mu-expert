import React, { useEffect, useState } from 'react';
import { Save, Crosshair, Unlock, Package, Minus, Plus, ShieldAlert, Leaf, Search, Trophy } from 'lucide-react';
import { ScriptSettingsCard } from './shared/ScriptSettingsCard';
import { toast } from 'react-hot-toast';

// Unit Images (using local assets if available or fallback to CDN)
const UNIT_IMAGES: Record<string, string> = {
    spear: 'https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_spear.png',
    sword: 'https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_sword.png',
    axe: 'https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_axe.png',
    archer: 'https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_archer.png',
    light: 'https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_light.png',
    marcher: 'https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_marcher.png',
    heavy: 'https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_heavy.png',
};

interface ScavengeConfigProps {
    user: any
    updateUser: (user: any) => void
}

const UNITS = ['spear', 'sword', 'axe', 'archer', 'light', 'marcher', 'heavy'];

const ScavengeConfig: React.FC<ScavengeConfigProps> = ({ user, updateUser }) => {
    const [config, setConfig] = useState({
        active: false,
        autoUnlock: false,
        autoUnlockLevels: [true, true, true, true],
        stopIfUnderAttack: false,
        hours: 2,
        distributionMode: 'prioritize', // 'prioritize' | 'equal'
        units: {
            spear: true,
            sword: true,
            axe: false,
            archer: false,
            light: false,
            marcher: false,
            heavy: false,
        },
        reserves: {
            spear: 0,
            sword: 0,
            axe: 0,
            archer: 0,
            light: 0,
            marcher: 0,
            heavy: 0,
        },
    });

    // Local state for free typing (e.g. "2,5")
    const [localHours, setLocalHours] = useState(config.hours?.toString() || '2');

    useEffect(() => {
        // Sync local input when config changes externally (e.g. buttons or initial load)
        setLocalHours(config.hours?.toString() || '2');
    }, [config.hours]);

    useEffect(() => {
        if (user?.globalSettings?.scavenge) {
            console.log('CARREGANDO CONFIG (Scavenge) DO USUARIO:', user.globalSettings.scavenge);
            setConfig(prev => ({ ...prev, ...user.globalSettings.scavenge }));
        } else {
            const saved = localStorage.getItem('scavenge_config');
            if (saved) {
                try {
                    setConfig((prev) => ({ ...prev, ...JSON.parse(saved) }));
                } catch (e) {
                    console.error('Failed to parse scavenge config', e);
                }
            }
        }
    }, [user]);

    const handleSave = async () => {
        localStorage.setItem('scavenge_config', JSON.stringify(config));

        try {
            const payload = {
                userUuid: user.uuid,
                settings: {
                    scavenge: config
                }
            };

            console.log('ENVIANDO DADOS (Scavenge):', payload);

            const result = await (window as any).ipcRenderer.invoke('scavenge:save-settings', payload);

            console.log('RETORNO DA API (Scavenge):', result);

            if (result.success) {
                if (result.user) updateUser(result.user);
                toast.success('Configuração de Coleta Salva no Servidor!');
            } else {
                toast.error('Erro ao salvar no servidor: ' + result.error);
            }
        } catch (err: any) {
            toast.error('Erro de conexão ao salvar: ' + err.message);
        }
    };

    const toggleUnit = (unit: string) => {
        setConfig((prev: any) => ({
            ...prev,
            units: {
                ...prev.units,
                [unit]: !prev.units[unit],
            },
        }));
    };

    const updateReserve = (unit: string, value: string) => {
        setConfig((prev: any) => ({
            ...prev,
            reserves: {
                ...prev.reserves,
                [unit]: parseInt(value) || 0,
            },
        }));
    };

    return (
        <div className="flex flex-col gap-6 w-full pb-20">

            {/* Header Card */}
            <div className="bg-[#18181b] rounded-3xl p-6 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex items-center gap-5 w-full">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 flex items-center justify-center border border-emerald-600/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] shrink-0">
                        <Package className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Auto Coleta</h1>
                        <p className="text-zinc-400 text-sm font-medium">Automatize o envio de tropas para busca de recursos.</p>
                    </div>
                </div>


            </div>

            <ScriptSettingsCard
                title="Configurações de Coleta"
                description="Defina quais unidades usar e as regras de distribuição."
            >
                <div className="flex flex-col gap-6">

                    {/* Top Row: General Settings & Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Auto Unlock */}
                        {/* Auto Unlock */}
                        <div className={`relative bg-[#09090b] rounded-2xl p-6 border transition-all duration-300 ${config.autoUnlock ? 'border-emerald-500/20' : 'border-emerald-500/10'}`}>
                            {config.autoUnlock && <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />}
                            <div className="relative z-10 flex flex-col h-full gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center border border-emerald-600/20">
                                            <Unlock className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white">Auto Desbloqueio</h3>
                                            <p className="text-[10px] text-zinc-400 font-medium">Níveis de coleta</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={config.autoUnlock}
                                            onChange={(e) => setConfig((prev) => ({ ...prev, autoUnlock: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-[#27272a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                                    </label>
                                </div>

                                {config.autoUnlock && (
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {[
                                            { label: 'Pequena', icon: Leaf },
                                            { label: 'Média', icon: Search },
                                            { label: 'Grande', icon: Package },
                                            { label: 'Extrema', icon: Trophy }
                                        ].map((level, index) => {
                                            const Icon = level.icon;
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        const newLevels = [...(config.autoUnlockLevels || [true, true, true, true])];
                                                        newLevels[index] = !newLevels[index];
                                                        setConfig(prev => ({ ...prev, autoUnlockLevels: newLevels }));
                                                    }}
                                                    className={`py-2 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center gap-2 ${(config.autoUnlockLevels || [true, true, true, true])[index]
                                                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                                        : 'bg-zinc-800/50 border-white/5 text-zinc-500 hover:bg-zinc-800'
                                                        }`}
                                                >
                                                    <Icon className="w-3 h-3" />
                                                    {level.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stop If Under Attack */}
                        <div className={`relative bg-[#09090b] rounded-2xl p-6 border transition-all duration-300 ${config.stopIfUnderAttack ? 'border-red-500/20' : 'border-red-500/10'}`}>
                            {config.stopIfUnderAttack && <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />}
                            <div className="relative z-10 flex flex-col justify-between h-full gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center border border-red-600/20">
                                        <ShieldAlert className="w-5 h-5 text-red-500" />
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={config.stopIfUnderAttack}
                                            onChange={(e) => setConfig((prev: any) => ({ ...prev, stopIfUnderAttack: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-[#27272a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                                    </label>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Pausar com Ataques</h3>
                                    <p className="text-[10px] text-zinc-400 font-medium mt-1">Não coletar se houver ataques vindo</p>
                                </div>
                            </div>
                        </div>

                        {/* Max Hours */}
                        <div className="bg-[#111113] rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
                            <h3 className="text-sm font-bold text-white mb-2">Tempo Máximo</h3>
                            <div className="flex items-center justify-between gap-2">
                                <button
                                    onClick={() => setConfig(prev => ({ ...prev, hours: Math.max(0.5, (prev.hours || 2) - 0.5) }))}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#18181b] hover:bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <div className="flex items-baseline gap-1">
                                    <input
                                        type="text"
                                        value={localHours}
                                        onChange={(e) => setLocalHours(e.target.value)}
                                        onBlur={() => {
                                            let val = parseFloat(localHours.replace(',', '.'));
                                            if (isNaN(val) || val <= 0) val = 2;
                                            setConfig(prev => ({ ...prev, hours: val }));
                                            setLocalHours(val.toString());
                                        }}
                                        className="bg-transparent text-white text-xl font-bold text-center w-12 focus:outline-none"
                                    />
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase">H</span>
                                </div>
                                <button
                                    onClick={() => setConfig(prev => ({ ...prev, hours: Math.min(24, (prev.hours || 2) + 0.5) }))}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#18181b] hover:bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Distribution Mode */}
                        <div className="bg-[#111113] rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
                            <div className="flex items-center gap-2 mb-2">
                                <Crosshair className="w-4 h-4 text-blue-500" />
                                <h3 className="text-sm font-bold text-white">Distribuição</h3>
                            </div>
                            <select
                                value={config.distributionMode}
                                onChange={(e) => setConfig(prev => ({ ...prev, distributionMode: e.target.value }))}
                                className="bg-[#18181b] border border-white/5 rounded-xl text-white text-xs font-bold py-2.5 px-3 focus:outline-none focus:border-blue-500 cursor-pointer w-full"
                            >
                                <option value="prioritize">Priorizar Maiores</option>
                                <option value="equal">Distribuir Igual</option>
                            </select>
                        </div>
                    </div>

                    {/* Unit Selection */}
                    <div className="bg-[#111113] rounded-2xl p-6 border border-white/5">
                        <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            Unidades para Coleta
                        </h3>
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                            {UNITS.map((unit) => (
                                <button
                                    key={unit}
                                    onClick={() => toggleUnit(unit)}
                                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 group overflow-hidden ${(config.units as any)[unit]
                                        ? 'bg-[#18181b] border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                        : 'bg-[#18181b] border-white/5 opacity-60 hover:opacity-100 hover:border-white/10'
                                        }`}
                                >
                                    {(config.units as any)[unit] && <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />}
                                    <img src={UNIT_IMAGES[unit]} alt={unit} className={`w-8 h-8 mb-2 transition-all duration-300 transform ${(config.units as any)[unit] ? 'scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'grayscale'}`} />
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${(config.units as any)[unit] ? 'text-emerald-400' : 'text-zinc-500'}`}>{unit}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reserves */}
                    <div className="bg-[#111113] rounded-2xl p-6 border border-white/5">
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                Reservas de Tropas
                            </h3>
                            <p className="text-[10px] text-zinc-500 mt-1 ml-4">Estas unidades nunca serão enviadas para coleta.</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                            {UNITS.map((unit) => (
                                <div key={`reserve-${unit}`} className="bg-[#18181b] p-3 rounded-xl border border-white/5 flex flex-col items-center gap-3 group hover:border-white/10 transition-colors">
                                    <img src={UNIT_IMAGES[unit]} alt={unit} className="w-8 h-8 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <input
                                        type="number"
                                        value={(config.reserves as any)[unit]}
                                        onChange={(e) => updateReserve(unit, e.target.value)}
                                        className="w-full bg-[#111113] border border-white/5 rounded-lg py-1.5 px-2 text-center text-white text-sm font-bold outline-none focus:border-red-500 transition-colors"
                                        placeholder="0"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase text-xs tracking-wider px-6 py-3 rounded-lg shadow-lg shadow-emerald-500/10 transition-all flex items-center gap-2 self-end"
                    >
                        <Save className="w-4 h-4" /> SALVAR CONFIGURAÇÕES
                    </button>
                </div>
            </ScriptSettingsCard>
        </div>
    );
};

export default ScavengeConfig;
