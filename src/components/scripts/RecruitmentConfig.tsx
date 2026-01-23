import React, { useState, useRef } from 'react'
import { Save, Shield, Hammer, ListOrdered, Upload, Download } from 'lucide-react'
import Modal from '../../components/Modal'
import ConfirmationModal from '../ConfirmationModal'
import { ScriptSection } from './shared/ScriptSection'
import { ScriptSettingsCard } from './shared/ScriptSettingsCard'
import { ScriptModelCard } from './shared/ScriptModelCard'
import { toast } from 'react-hot-toast'
import unitsData from '../../data/units.json'

interface UnitCount {
    spear: number
    sword: number
    axe: number
    archer: number
    spy: number
    light: number
    marcher: number
    heavy: number
    ram: number
    catapult: number
}

interface RecruitmentModel {
    uuid: string
    name: string
    units: UnitCount
}

interface GlobalSettings {
    recruitment: {
        active: boolean
        limits: {
            infantry: number
            cavalry: number
            garage: number
        }
        reserves: {
            wood: number
            stone: number
            iron: number
            pop: number
        }
        maxQueue: number
        minScore: number
        autoResearch: boolean
    }
}

// Load local assets
// We need to load from both buildings and units directories
const buildingAssets = import.meta.glob('../../assets/buildings/*.webp', { eager: true, query: '?url', import: 'default' })
const unitAssets = import.meta.glob('../../assets/units/*.webp', { eager: true, query: '?url', import: 'default' })

// Helper to check both locations if type not specified, or specific if known
const getBuildingAsset = (name: string) => {
    const path = `../../assets/buildings/${name}.webp`
    return (buildingAssets[path] as string) || ''
}

const getUnitAsset = (name: string) => {
    const path = `../../assets/units/${name}.webp`
    return (unitAssets[path] as string) || ''
}

const BUILDING_IMAGES = {
    barracks: getBuildingAsset('barracks'),
    stable: getBuildingAsset('stable'),
    garage: getBuildingAsset('garage')
}

const RESOURCE_IMAGES = {
    wood: getBuildingAsset('wood'),
    stone: getBuildingAsset('stone'),
    iron: getBuildingAsset('iron'),
    pop: getBuildingAsset('face') || getBuildingAsset('pop') // Try both face and pop
}

const DEFAULT_UNITS: UnitCount = {
    spear: 0, sword: 0, axe: 0, archer: 0,
    spy: 0, light: 0, marcher: 0, heavy: 0,
    ram: 0, catapult: 0
}

const UNIT_IMAGES: Record<keyof UnitCount, string> = {
    spear: getUnitAsset('spear'),
    sword: getUnitAsset('sword'),
    axe: getUnitAsset('axe'),
    archer: getUnitAsset('archer'),
    spy: getUnitAsset('spy'),
    light: getUnitAsset('light'),
    marcher: getUnitAsset('marcher'),
    heavy: getUnitAsset('heavy'),
    ram: getUnitAsset('ram'),
    catapult: getUnitAsset('catapult')
}

interface RecruitmentConfigProps {
    user: any
    updateUser: (user: any) => void
}

const RecruitmentConfig: React.FC<RecruitmentConfigProps> = ({ user, updateUser }) => {
    // State
    const [models, setModels] = useState<RecruitmentModel[]>([])

    const [settings, setSettings] = useState<GlobalSettings>({
        recruitment: {
            active: false,
            limits: {
                infantry: 5,
                cavalry: 2,
                garage: 2
            },
            reserves: {
                wood: 0,
                stone: 0,
                iron: 0,
                pop: 0
            },
            maxQueue: 5,
            minScore: 0,
            autoResearch: false
        }
    })

    // Helper: Calculate total pop
    const calculateTotalPop = (units: UnitCount) => {
        let total = 0
        Object.entries(units).forEach(([key, count]) => {
            const unitInfo = (unitsData as any)[key]
            if (unitInfo) {
                total += count * unitInfo.pop
            }
        })
        return total
    }

    // Load data on mount
    React.useEffect(() => {
        const loadData = async () => {
            if (!user?.uuid) return
            try {
                // Load Models
                const modelsResult = await (window as any).ipcRenderer.invoke('recruitment:get-models', user.uuid)
                if (modelsResult.success) {
                    setModels(modelsResult.models)
                }

                // Load Settings
                const settingsResult = await (window as any).ipcRenderer.invoke('recruitment:get-settings', user.uuid)
                if (settingsResult.success && settingsResult.settings) {
                    // Check if new structure exists, otherwise try to map old fields or default
                    const raw = settingsResult.settings;

                    // If backend already returned new structure (which it does via getSettings -> globalSettings)
                    if (raw.recruitment) {
                        setSettings(prev => ({ ...prev, recruitment: { ...prev.recruitment, ...raw.recruitment } }))
                    } else {
                        // Fallback or migration if needed (though backend getSettings returns root globalSettings)
                        // If user has old data, 'raw' has 'recruit_limit_infantry' etc.
                        // But we want to use the new local state structure.
                        // We can try to map old values if they exist, to be nice.
                        const mappedRecruitment = {
                            active: raw.recruitment?.active ?? false,
                            limits: {
                                infantry: raw.recruit_limit_infantry ?? raw.recruitment?.limits?.infantry ?? 5,
                                cavalry: raw.recruit_limit_cavalry ?? raw.recruitment?.limits?.cavalry ?? 2,
                                garage: raw.recruit_limit_garage ?? raw.recruitment?.limits?.garage ?? 2
                            },
                            reserves: {
                                wood: raw.reserved_wood ?? raw.recruitment?.reserves?.wood ?? 0,
                                stone: raw.reserved_stone ?? raw.recruitment?.reserves?.stone ?? 0,
                                iron: raw.reserved_iron ?? raw.recruitment?.reserves?.iron ?? 0,
                                pop: raw.reserved_pop ?? raw.recruitment?.reserves?.pop ?? 0
                            },
                            maxQueue: raw.recruit_max_queue ?? raw.recruitment?.maxQueue ?? 5,
                            minScore: raw.recruit_min_score ?? raw.recruitment?.minScore ?? 0,
                            autoResearch: raw.auto_research ?? raw.recruitment?.autoResearch ?? false
                        };
                        setSettings({ recruitment: mappedRecruitment });
                    }
                }
            } catch (error) {
                console.error('Failed to load recruitment data', error)
                toast.error('Erro ao carregar dados')
            }
        }
        loadData()
    }, [user?.uuid])

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingModel, setEditingModel] = useState<RecruitmentModel | null>(null)
    const [formData, setFormData] = useState<{ name: string, units: UnitCount }>({
        name: '',
        units: { ...DEFAULT_UNITS }
    })

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [modelToDelete, setModelToDelete] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleExport = () => {
        try {
            const dataStr = JSON.stringify(models, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `recruitment_models_${new Date().toISOString().slice(0, 10)}.json`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success('Modelos exportados com sucesso!');
        } catch (error) {
            console.error('Erro ao exportar:', error);
            toast.error('Erro ao exportar modelos');
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = async (ev) => {
            try {
                const content = ev.target?.result as string
                const importedModels = JSON.parse(content)

                if (!Array.isArray(importedModels)) throw new Error('Arquivo inválido: deve ser uma lista de modelos')

                let successCount = 0
                const loadingToast = toast.loading('Importando modelos...')

                for (const model of importedModels) {
                    if (!model.name || !model.units) continue

                    // Ensure units object structure matches
                    const cleanUnits = { ...DEFAULT_UNITS }
                    if (model.units) {
                        Object.keys(cleanUnits).forEach(key => {
                            if (typeof model.units[key] === 'number') {
                                cleanUnits[key as keyof UnitCount] = model.units[key]
                            }
                        })
                    }

                    const result = await (window as any).ipcRenderer.invoke('recruitment:save-model', {
                        userUuid: user.uuid,
                        model: {
                            name: model.name,
                            units: cleanUnits
                        }
                    })

                    if (result.success) successCount++
                }

                toast.dismiss(loadingToast)
                toast.success(`${successCount} modelos importados!`)

                // Refresh
                const modelsResult = await (window as any).ipcRenderer.invoke('recruitment:get-models', user.uuid)
                if (modelsResult.success) {
                    setModels(modelsResult.models)
                }

            } catch (err) {
                console.error(err)
                toast.error('Erro ao processar arquivo')
            }
        }
        reader.readAsText(file)
        e.target.value = ''
    }

    const handleSaveModel = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim()) return toast.error('Nome do modelo é obrigatório')

        const modelToSave = {
            ...(editingModel ? { uuid: editingModel.uuid } : {}),
            name: formData.name,
            units: formData.units
        }

        try {
            const result = await (window as any).ipcRenderer.invoke('recruitment:save-model', {
                userUuid: user.uuid,
                model: modelToSave
            })

            if (result.success) {
                if (editingModel) {
                    setModels(models.map(m => m.uuid === result.model.uuid ? result.model : m))
                    toast.success('Modelo atualizado!')
                } else {
                    setModels([...models, result.model])
                    toast.success('Modelo criado!')
                }
                setIsModalOpen(false)
            } else {
                toast.error('Erro ao salvar modelo: ' + result.error)
            }
        } catch (error) {
            console.error(error)
            toast.error('Erro ao salvar modelo')
        }
    }

    const handleSaveSettings = async () => {
        try {
            // Save nested 'recruitment' settings
            const settingsToSave = {
                recruitment: settings.recruitment
            }

            const result = await (window as any).ipcRenderer.invoke('recruitment:save-settings', {
                userUuid: user.uuid,
                settings: settingsToSave
            })

            if (result.success) {
                if (result.user) updateUser(result.user)
                toast.success('Configurações salvas!')
            } else {
                toast.error('Erro ao salvar: ' + result.error)
            }
        } catch (error) {
            console.error(error)
            toast.error('Erro ao salvar configurações')
        }
    }

    const openEdit = (model: RecruitmentModel) => {
        setEditingModel(model)
        setFormData({ name: model.name, units: { ...model.units } })
        setIsModalOpen(true)
    }

    const openNew = () => {
        setEditingModel(null)
        setFormData({ name: '', units: { ...DEFAULT_UNITS } })
        setIsModalOpen(true)
    }

    const handleDelete = (id: string) => {
        setModelToDelete(id)
        setShowDeleteModal(true)
    }

    const confirmDelete = async () => {
        if (!modelToDelete) return

        try {
            const result = await (window as any).ipcRenderer.invoke('recruitment:delete-model', {
                userUuid: user.uuid,
                modelUuid: modelToDelete
            })

            if (result.success) {
                setModels(models.filter(m => m.uuid !== modelToDelete))
                toast.success('Modelo removido')
            } else {
                toast.error('Erro ao remover: ' + result.error)
            }
        } catch (error) {
            console.error(error)
            toast.error('Erro ao remover modelo')
        } finally {
            setShowDeleteModal(false)
            setModelToDelete(null)
        }
    }

    return (
        <div className="h-full flex flex-col gap-6 pb-6">
            {/* Section 1: Settings */}
            <ScriptSettingsCard
                title="Opções de Recrutamento"
                description="Defina os limites e reservas de recursos."
            >
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


                        {/* Auto Research & Min Score */}
                        <div className="flex flex-col gap-6">
                            {/* Auto Research */}
                            <div className={`relative bg-[#09090b] rounded-2xl p-6 border transition-all duration-300 overflow-hidden ${settings.recruitment.autoResearch ? 'border-emerald-500/20' : 'border-emerald-500/10'}`}>
                                {settings.recruitment.autoResearch && <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />}
                                <div className="relative z-10 flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-600/10 flex items-center justify-center border border-emerald-600/20">
                                            <Hammer className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-white leading-tight">Pesquisar Unidades</h3>
                                            <p className="text-xs text-zinc-400 font-medium mt-1">Automaticamente na Academia/Ferreiro</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.recruitment.autoResearch}
                                            onChange={(e) => setSettings({ ...settings, recruitment: { ...settings.recruitment, autoResearch: e.target.checked } })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Min Points Trigger */}
                            <div className="bg-[#111113] rounded-2xl p-6 border border-white/5 flex flex-col justify-between group hover:border-white/10 transition-colors h-full">
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#18181b] flex items-center justify-center border border-white/5">
                                            <Shield className="w-5 h-5 text-orange-400" />
                                        </div>
                                        <span className="text-sm font-bold text-white">Pontuação Mínima</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={settings.recruitment.minScore || 0}
                                        onChange={(e) => setSettings({ ...settings, recruitment: { ...settings.recruitment, minScore: parseInt(e.target.value) || 0 } })}
                                        className="w-20 bg-[#18181b] border border-white/5 rounded-xl py-2 px-3 text-center text-white text-lg font-bold outline-none focus:border-orange-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        placeholder="0"
                                    />
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Não recrutar em aldeias com menos de X pontos (0 para desativar).
                                </p>
                            </div>
                        </div>

                        {/* Limits Card */}
                        <div className="bg-[#111113] rounded-2xl p-6 border border-white/5 flex flex-col group hover:border-white/10 transition-colors">
                            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                                <ListOrdered className="w-4 h-4 text-emerald-500" />
                                Limites de Recrutamento
                            </h3>

                            <div className="flex-1 flex flex-col justify-center gap-4">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-[#18181b] p-3 rounded-xl border border-white/5 flex flex-col items-center gap-2">
                                        {BUILDING_IMAGES.barracks && <img src={BUILDING_IMAGES.barracks} alt="Barracks" className="w-8 h-8 object-contain opacity-80" />}
                                        <input
                                            type="number"
                                            value={settings.recruitment.limits.infantry || 0}
                                            onChange={(e) => setSettings({ ...settings, recruitment: { ...settings.recruitment, limits: { ...settings.recruitment.limits, infantry: parseInt(e.target.value) || 0 } } })}
                                            className="w-full bg-transparent text-center text-white font-bold outline-none border-b border-white/10 focus:border-emerald-500 pb-1"
                                        />
                                    </div>
                                    <div className="bg-[#18181b] p-3 rounded-xl border border-white/5 flex flex-col items-center gap-2">
                                        {BUILDING_IMAGES.stable && <img src={BUILDING_IMAGES.stable} alt="Stable" className="w-8 h-8 object-contain opacity-80" />}
                                        <input
                                            type="number"
                                            value={settings.recruitment.limits.cavalry || 0}
                                            onChange={(e) => setSettings({ ...settings, recruitment: { ...settings.recruitment, limits: { ...settings.recruitment.limits, cavalry: parseInt(e.target.value) || 0 } } })}
                                            className="w-full bg-transparent text-center text-white font-bold outline-none border-b border-white/10 focus:border-emerald-500 pb-1"
                                        />
                                    </div>
                                    <div className="bg-[#18181b] p-3 rounded-xl border border-white/5 flex flex-col items-center gap-2">
                                        {BUILDING_IMAGES.garage && <img src={BUILDING_IMAGES.garage} alt="Garage" className="w-8 h-8 object-contain opacity-80" />}
                                        <input
                                            type="number"
                                            value={settings.recruitment.limits.garage || 0}
                                            onChange={(e) => setSettings({ ...settings, recruitment: { ...settings.recruitment, limits: { ...settings.recruitment.limits, garage: parseInt(e.target.value) || 0 } } })}
                                            className="w-full bg-transparent text-center text-white font-bold outline-none border-b border-white/10 focus:border-emerald-500 pb-1"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-[#18181b] p-3 rounded-xl border border-white/5 mt-auto">
                                    <span className="text-xs font-bold text-zinc-400">Filas Máx.</span>
                                    <input
                                        type="number"
                                        value={settings.recruitment.maxQueue || 2}
                                        onChange={(e) => setSettings({ ...settings, recruitment: { ...settings.recruitment, maxQueue: parseInt(e.target.value) || 0 } })}
                                        className="w-12 bg-transparent text-center text-white font-bold outline-none border-b border-white/10 focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Resources Card */}
                        <div className="bg-[#111113] rounded-2xl p-6 border border-white/5 flex flex-col group hover:border-white/10 transition-colors">
                            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                Reserva de Recursos
                            </h3>

                            <div className="grid grid-cols-2 gap-3 flex-1">
                                <div className="bg-[#18181b] p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                                    <div className="flex items-center gap-2 mb-2">
                                        {RESOURCE_IMAGES.wood && <img src={RESOURCE_IMAGES.wood} alt="Wood" className="w-5 h-5 object-contain" />}
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Madeira</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={settings.recruitment.reserves.wood || 0}
                                        onChange={(e) => setSettings({ ...settings, recruitment: { ...settings.recruitment, reserves: { ...settings.recruitment.reserves, wood: parseInt(e.target.value) || 0 } } })}
                                        className="w-full bg-[#111113] rounded-lg py-1.5 px-2 text-right text-white font-bold text-sm outline-none focus:ring-1 focus:ring-amber-500/50 border border-white/5"
                                    />
                                </div>
                                <div className="bg-[#18181b] p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                                    <div className="flex items-center gap-2 mb-2">
                                        {RESOURCE_IMAGES.stone && <img src={RESOURCE_IMAGES.stone} alt="Stone" className="w-5 h-5 object-contain" />}
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Argila</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={settings.recruitment.reserves.stone || 0}
                                        onChange={(e) => setSettings({ ...settings, recruitment: { ...settings.recruitment, reserves: { ...settings.recruitment.reserves, stone: parseInt(e.target.value) || 0 } } })}
                                        className="w-full bg-[#111113] rounded-lg py-1.5 px-2 text-right text-white font-bold text-sm outline-none focus:ring-1 focus:ring-amber-500/50 border border-white/5"
                                    />
                                </div>
                                <div className="bg-[#18181b] p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                                    <div className="flex items-center gap-2 mb-2">
                                        {RESOURCE_IMAGES.iron && <img src={RESOURCE_IMAGES.iron} alt="Iron" className="w-5 h-5 object-contain" />}
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Ferro</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={settings.recruitment.reserves.iron || 0}
                                        onChange={(e) => setSettings({ ...settings, recruitment: { ...settings.recruitment, reserves: { ...settings.recruitment.reserves, iron: parseInt(e.target.value) || 0 } } })}
                                        className="w-full bg-[#111113] rounded-lg py-1.5 px-2 text-right text-white font-bold text-sm outline-none focus:ring-1 focus:ring-amber-500/50 border border-white/5"
                                    />
                                </div>
                                <div className="bg-[#18181b] p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                                    <div className="flex items-center gap-2 mb-2">
                                        {RESOURCE_IMAGES.pop && <img src={RESOURCE_IMAGES.pop} alt="Pop" className="w-5 h-5 object-contain" />}
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Pop.</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={settings.recruitment.reserves.pop || 0}
                                        onChange={(e) => setSettings({ ...settings, recruitment: { ...settings.recruitment, reserves: { ...settings.recruitment.reserves, pop: parseInt(e.target.value) || 0 } } })}
                                        className="w-full bg-[#111113] rounded-lg py-1.5 px-2 text-right text-white font-bold text-sm outline-none focus:ring-1 focus:ring-blue-500/50 border border-white/5"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    <button
                        onClick={handleSaveSettings}
                        className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs tracking-wider px-6 py-3 rounded-lg shadow-lg shadow-emerald-500/10 transition-all flex items-center gap-2 self-end"
                    >
                        <Save className="w-4 h-4" /> SALVAR CONFIGURAÇÕES
                    </button>
                </div>
            </ScriptSettingsCard>

            {/* Section 2: Manage Models */}
            <ScriptSection
                title="Gerenciar Modelos"
                subtitle="Crie e edite seus templates de tropas."
                icon={Shield}
                onAction={openNew}
                actionLabel="Novo Modelo"
                headerActions={
                    <>
                        <input
                            type="file"
                            accept=".json"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/5 px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-xs uppercase tracking-wider h-9"
                        >
                            <Upload className="w-4 h-4" />
                            Importar
                        </button>
                        <button
                            onClick={handleExport}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/5 px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-xs uppercase tracking-wider h-9"
                        >
                            <Download className="w-4 h-4" />
                            Exportar
                        </button>
                    </>
                }
            >
                <div className="flex flex-col gap-4">
                    {models.map(model => {
                        const totalPop = calculateTotalPop(model.units)

                        return (
                            <ScriptModelCard
                                key={model.uuid}
                                title={model.name}
                                onEdit={() => openEdit(model)}
                                onDelete={() => handleDelete(model.uuid)}
                            >
                                <div className="flex flex-col gap-4">
                                    {/* Stats Row */}
                                    <div className="flex items-center gap-6 border-b border-white/5 pb-3 mb-1">
                                        <div className="flex items-center gap-2" title="População Utilizada">
                                            <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                                <span className="text-blue-500 font-black text-xs">POP</span>
                                            </div>
                                            <span className="text-white font-bold text-sm">{totalPop.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(model.units).map(([key, value]) => {
                                            if (value === 0) return null
                                            return (
                                                <div key={key} className="flex flex-col items-center gap-1 bg-[#18181b]/50 border border-white/5 p-2 rounded-xl min-w-[50px]">
                                                    <div className="relative">
                                                        {UNIT_IMAGES[key as keyof UnitCount] && <img src={UNIT_IMAGES[key as keyof UnitCount]} alt={key} className="w-10 h-10 object-contain filter drop-shadow-lg" />}
                                                        <div className="absolute -bottom-1 -right-2 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md border border-[#18181b] shadow-sm">
                                                            {value}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </ScriptModelCard>
                        )
                    })}

                    {models.length === 0 && (
                        <div className="col-span-full py-10 text-center border-2 border-dashed border-white/5 rounded-2xl">
                            <p className="text-zinc-500 font-medium text-sm">Nenhum modelo criado ainda.</p>
                        </div>
                    )}
                </div>
            </ScriptSection>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingModel ? 'Editar Modelo' : 'Criar Novo Modelo'}
                maxWidth="max-w-[95vw] md:max-w-6xl"
            >
                <form onSubmit={handleSaveModel} className="p-6 bg-[#111111]">
                    <div className="mb-4">
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Nome do Modelo</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Ataque Full"
                            className="w-full bg-[#27272a] border border-white/10 rounded-xl py-2.5 px-3 text-white outline-none focus:border-emerald-600 font-medium text-base"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-4">
                        {/* Unit Groups */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-full h-[1px] bg-white/5"></span>
                                Unidades
                                <span className="w-full h-[1px] bg-white/5"></span>
                            </h4>

                            <div className="flex flex-wrap gap-4 justify-center bg-[#18181b]/30 p-6 rounded-2xl border border-white/5">
                                {Object.keys(UNIT_IMAGES).map((unitKey) => {
                                    const key = unitKey as keyof UnitCount
                                    return (
                                        <div key={key} className="bg-[#18181b] border border-white/5 p-3 rounded-xl flex flex-col items-center gap-2 hover:border-emerald-600/30 transition-colors group w-24 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-emerald-600/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />

                                            <div className="relative z-10 group-focus-within:scale-110 transition-transform duration-300">
                                                {UNIT_IMAGES[key] && <img src={UNIT_IMAGES[key]} alt={key} className="w-10 h-10 object-contain drop-shadow-md" />}
                                            </div>

                                            <div className="w-full relative z-10">
                                                <input
                                                    type="number"
                                                    value={formData.units[key]}
                                                    onChange={e => setFormData({ ...formData, units: { ...formData.units, [key]: parseInt(e.target.value) || 0 } })}
                                                    className="w-full bg-[#27272a] border border-white/10 rounded-lg py-1.5 px-1 text-center text-white text-sm outline-none focus:border-emerald-600 font-bold focus:shadow-[0_0_10px_rgba(5,150,105,0.2)] transition-all"
                                                    min="0"
                                                    onFocus={(e) => e.target.select()}
                                                />
                                            </div>

                                            <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-600/10 rounded-full blur-xl group-focus-within:bg-emerald-600/30 transition-colors pointer-events-none"></div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3 justify-end pt-4 border-t border-white/5">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 font-bold text-xs transition-all cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-save px-5 py-2.5 text-xs"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </Modal>
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Remover Modelo"
                message="Tem certeza que deseja remover este modelo de recrutamento? Esta ação não pode ser desfeita."
                confirmText="Remover"
                variant="danger"
            />
        </div >
    )
}

export default RecruitmentConfig
