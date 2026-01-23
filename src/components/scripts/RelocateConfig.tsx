import React, { useEffect, useState } from 'react';
import { Save, Compass, Globe, Users, Dices } from 'lucide-react';
import { ScriptSettingsCard } from './shared/ScriptSettingsCard';
import { toast } from 'react-hot-toast';

interface RelocateConfigProps {
    user: any
    updateUser: (user: any) => void
}

const DIRECTIONS = [
    { id: 'nw', label: 'Noroeste', short: 'NO', deg: -45 },
    { id: 'ne', label: 'Nordeste', short: 'NE', deg: 45 },
    { id: 'sw', label: 'Sudoeste', short: 'SO', deg: -135 },
    { id: 'se', label: 'Sudeste', short: 'SE', deg: 135 },
];

const RelocateConfig: React.FC<RelocateConfigProps> = ({ user, updateUser }) => {
    const [config, setConfig] = useState({
        active: false,
        direction: 'nw', // nw, ne, sw, se, random, multi
        multiStyle: false,
        accountIds: [] as string[]
    });
    const [accounts, setAccounts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user?.globalSettings?.relocate) {
            setConfig(prev => ({ ...prev, ...user.globalSettings.relocate }));
        }

        // Fetch accounts
        const fetchAccounts = async () => {
            try {
                const result = await (window as any).ipcRenderer.invoke('accounts:get', user.uuid);
                if (Array.isArray(result)) {
                    setAccounts(result);
                }
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        };
        fetchAccounts();
    }, [user]);

    const handleToggleAccount = (accountId: string) => {
        setConfig(prev => {
            const currentIds = prev.accountIds || [];
            if (currentIds.includes(accountId)) {
                return { ...prev, accountIds: currentIds.filter(id => id !== accountId) };
            } else {
                return { ...prev, accountIds: [...currentIds, accountId] };
            }
        });
    };

    const handleSelectAll = () => {
        const filtered = accounts.filter(acc => acc.name.toLowerCase().includes(searchTerm.toLowerCase()));
        const filteredIds = filtered.map(a => a._id);
        const currentIds = config.accountIds || [];
        // Add only filtered IDs to current selection
        const uniqueIds = Array.from(new Set([...currentIds, ...filteredIds]));
        setConfig(prev => ({ ...prev, accountIds: uniqueIds }));
    };

    const handleDeselectAll = () => {
        const filtered = accounts.filter(acc => acc.name.toLowerCase().includes(searchTerm.toLowerCase()));
        const filteredIds = filtered.map(a => a._id);
        const currentIds = config.accountIds || [];
        // Remove filtered IDs from current selection
        const remainingIds = currentIds.filter(id => !filteredIds.includes(id));
        setConfig(prev => ({ ...prev, accountIds: remainingIds }));
    };

    const handleSaveSettings = async () => {
        try {
            const payload = {
                userUuid: user.uuid,
                settings: {
                    relocate: config
                }
            };

            const result = await (window as any).ipcRenderer.invoke('user:update-settings', payload);

            if (result.success) {
                updateUser(result.user);
                toast.success('Configuração de Reposicionamento salva!');
            } else {
                toast.error('Erro ao salvar: ' + result.error);
            }
        } catch (error: any) {
            toast.error('Erro ao salvar: ' + error.message);
        }
    };

    const filteredAccounts = accounts.filter(acc =>
        acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.world?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 w-full pb-20">
            {/* Header Card */}
            <div className="bg-[#18181b] rounded-3xl p-6 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex items-center gap-5 w-full">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20 shadow-[0_0_30px_rgba(37,99,235,0.1)] shrink-0">
                        <Compass className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Reposicionamento</h1>
                        <p className="text-zinc-400 text-sm font-medium">Automatize o uso do item de reposicionamento.</p>
                    </div>
                </div>
            </div>

            <ScriptSettingsCard
                title="Fila de Reposicionamento"
                description="Selecione as contas que devem ser reposicionadas. Elas serão removidas da lista automaticamente após a execução."
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-2 gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Filtrar contas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all"
                            />
                        </div>

                        <div className="flex gap-2">
                            <span className="text-sm text-zinc-400 self-center mr-2 hidden md:block">
                                {config.accountIds?.length || 0} selecionadas
                            </span>
                            <button onClick={handleSelectAll} className="text-xs text-blue-500 hover:text-blue-400 font-medium px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 transition-colors whitespace-nowrap">
                                Selecionar Visíveis
                            </button>
                            <button onClick={handleDeselectAll} className="text-xs text-zinc-500 hover:text-zinc-400 font-medium px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors whitespace-nowrap">
                                Limpar Visíveis
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#09090b] rounded-xl border border-white/5 max-h-60 overflow-y-auto p-2 grid grid-cols-1 md:grid-cols-2 gap-2 custom-scrollbar">
                        {filteredAccounts.map(acc => (
                            <label key={acc._id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${(config.accountIds || []).includes(acc._id)
                                ? 'bg-blue-600/10 border-blue-500/30'
                                : 'bg-[#18181b] border-white/5 hover:border-white/10'
                                }`}>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${(config.accountIds || []).includes(acc._id)
                                    ? 'bg-blue-600 border-blue-500 text-white'
                                    : 'bg-zinc-900 border-zinc-600'
                                    }`}>
                                    {(config.accountIds || []).includes(acc._id) && <Users className="w-3 h-3" />}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-bold ${(config.accountIds || []).includes(acc._id) ? 'text-white' : 'text-zinc-400'}`}>
                                        {acc.name}
                                    </span>
                                    <span className="text-xs text-zinc-600">
                                        {acc.worldPrefix}
                                    </span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={(config.accountIds || []).includes(acc._id)}
                                    onChange={() => handleToggleAccount(acc._id)}
                                />
                            </label>
                        ))}
                    </div>
                </div>
            </ScriptSettingsCard>

            <ScriptSettingsCard
                title="Configurações de Destino"
                description="Escolha a direção e o estilo de reposicionamento."
            >
                <div className="flex flex-col gap-6">

                    {/* Active Toggle */}
                    <div className={`flex items-center justify-between bg-[#09090b] p-6 rounded-2xl border transition-all duration-300 ${config.active ? 'border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-white/5'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${config.active ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-zinc-800/50 border-white/5'}`}>
                                <Globe className={`w-5 h-5 ${config.active ? 'text-emerald-500' : 'text-zinc-500'}`} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">Ativar Reposicionamento</h3>
                                <p className="text-xs text-zinc-400 font-medium">O script tentará usar o item de reposicionamento</p>
                            </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={config.active}
                                onChange={(e) => setConfig({ ...config, active: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Direction Selection */}
                        <div className="bg-[#111113] rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                                <Compass className="w-4 h-4 text-blue-500" />
                                Direção Preferencial
                            </h3>

                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                {/* Random Option - Now Separate */}
                                <button
                                    onClick={() => setConfig({ ...config, direction: 'random' })}
                                    className={`col-span-2 p-4 rounded-xl border transition-all flex flex-row items-center justify-center gap-3 ${config.direction === 'random'
                                        ? 'bg-amber-600/10 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                                        : 'bg-[#18181b] border-white/5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                                        }`}
                                >
                                    <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center opacity-80">
                                        <Dices className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm uppercase tracking-wider">Aleatório</span>
                                </button>

                                {/* Multi Style Option - Now Separate */}
                                <button
                                    onClick={() => setConfig({ ...config, direction: 'multi' })}
                                    className={`col-span-2 p-4 rounded-xl border transition-all flex flex-row items-center justify-center gap-3 ${config.direction === 'multi'
                                        ? 'bg-purple-600/10 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.2)]'
                                        : 'bg-[#18181b] border-white/5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                                        }`}
                                >
                                    <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center opacity-80">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm uppercase tracking-wider">Estilo Multi</span>
                                </button>

                                {/* Cardinal Directions */}
                                {DIRECTIONS.map((dir) => (
                                    <button
                                        key={dir.id}
                                        onClick={() => setConfig({ ...config, direction: dir.id })}
                                        className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${config.direction === dir.id
                                            ? 'bg-blue-600/10 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                                            : 'bg-[#18181b] border-white/5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                                            }`}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-full border border-current flex items-center justify-center opacity-80"
                                            style={{ transform: `rotate(${dir.deg}deg)` }}
                                        >
                                            <div className="w-0.5 h-3 bg-current -mt-1 rounded-full"></div>
                                        </div>
                                        <span className="font-bold text-xs uppercase tracking-wider">{dir.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>


                    </div>

                    <button
                        onClick={handleSaveSettings}
                        className="bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase text-xs tracking-wider px-6 py-3 rounded-lg shadow-lg shadow-emerald-500/10 transition-all flex items-center gap-2 self-end mt-4"
                    >
                        <Save className="w-4 h-4" /> SALVAR CONFIGURAÇÕES
                    </button>
                </div>
            </ScriptSettingsCard>
        </div>
    );
};

export default RelocateConfig;
