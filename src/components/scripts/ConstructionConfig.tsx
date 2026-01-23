import React, { useState, useEffect, useRef } from 'react'
import Modal from '../../components/Modal'
import { Reorder } from 'framer-motion'
import { ScriptSection } from './shared/ScriptSection'
import { ScriptSettingsCard } from './shared/ScriptSettingsCard'
import { ScriptModelCard } from './shared/ScriptModelCard'
import { toast } from 'react-hot-toast'
import buildingsData from '../../data/buildings.json'
import { X, Save, Hammer, ListOrdered, GripVertical, ArrowUp, Upload, Download } from 'lucide-react'
import ConfirmationModal from '../ConfirmationModal'

// Generate short random ID
const uid = () => Math.random().toString(36).substr(2, 9)

interface QueueItem {
    id: string
    code: string
}

interface ConstructionModel {
    uuid: string
    name: string
    buildingOrder: string[]
    auto_farm: boolean
    auto_farm_level_trigger: number
    auto_farm_percent_new: number // Trigger when farm is X% full (wait, user said "Faltando 5% para lotar" or "Ultrapassarem 90%")
    // Let's use simple trigger logic: "Evoluir quando população > X%" ? 
    // User example: "Faltando 5% para lotar fazenda" -> means 95% full. 
    // "Quando recursos ultrapassarem 90% do armazém"

    auto_warehouse: boolean
    auto_warehouse_trigger: number // % capacity trigger
}

interface ConstructionSettings {
    active: boolean
    maxQueues: number
    autoFarm: boolean
    autoFarmLevelTrigger: number
    autoWarehouse: boolean
    autoWarehouseTrigger: number
}

const DEFAULT_SETTINGS: ConstructionSettings = {
    active: false,
    maxQueues: 2,
    autoFarm: false,
    autoFarmLevelTrigger: 90, // Default 90% full
    autoWarehouse: false,
    autoWarehouseTrigger: 90 // Default 90% full
}

// Load local assets
const assets = import.meta.glob('../../assets/buildings/*.webp', { eager: true, query: '?url', import: 'default' })

const getAsset = (name: string) => {
    const path = `../../assets/buildings/${name}.webp`
    return (assets[path] as string) || ''
}

const BUILDING_IMAGES: Record<string, string> = {
    main: getAsset('main'),
    barracks: getAsset('barracks'),
    stable: getAsset('stable'),
    garage: getAsset('garage'),
    church: getAsset('church'),
    church_f: getAsset('church_f'),
    watchtower: getAsset('watchtower'),
    snob: getAsset('snob'),
    smith: getAsset('smith'),
    place: getAsset('place'),
    statue: getAsset('statue'),
    market: getAsset('market'),
    wood: getAsset('wood'),
    stone: getAsset('stone'),
    iron: getAsset('iron'),
    farm: getAsset('farm'),
    storage: getAsset('storage'),
    hide: getAsset('hide'),
    wall: getAsset('wall'),
}

const AVAILABLE_BUILDINGS = [
    'main', 'barracks', 'stable', 'garage', 'church', 'church_f', 'watchtower',
    'snob', 'smith', 'place', 'statue', 'market', 'wood', 'stone', 'iron',
    'farm', 'storage', 'hide', 'wall'
]

const BUILDING_CODES_LEGACY = [
    'main', 'barracks', 'stable', 'garage', 'church', 'church_f', 'watchtower',
    'snob', 'smith', 'place', 'statue', 'market', 'wood', 'stone', 'iron',
    'farm', 'storage', 'hide', 'wall'
]

interface ConstructionConfigProps {
    user: any
    updateUser: (user: any) => void
}

const ConstructionConfig: React.FC<ConstructionConfigProps> = ({ user, updateUser }) => {
    // State
    const [models, setModels] = useState<ConstructionModel[]>([])
    const [settings, setSettings] = useState<ConstructionSettings>(DEFAULT_SETTINGS)

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            if (!user?.uuid) return
            try {
                // Load Models
                const modelsResult = await (window as any).ipcRenderer.invoke('construction:get-models', user.uuid)
                if (modelsResult.success) {
                    setModels(modelsResult.models)
                }

                // Load Settings
                const settingsResult = await (window as any).ipcRenderer.invoke('construction:get-settings', user.uuid)
                if (settingsResult.success && settingsResult.settings) {
                    const raw = settingsResult.settings;

                    if (raw.construction) {
                        setSettings(prev => ({ ...prev, ...raw.construction, active: raw.construction.active ?? false }))
                    } else {
                        // Migration/Fallback
                        setSettings({
                            active: raw.active ?? false,
                            maxQueues: raw.construction_max_queues ?? 2,
                            autoFarm: raw.auto_farm ?? false,
                            autoFarmLevelTrigger: raw.auto_farm_level_trigger ?? 90,
                            autoWarehouse: raw.auto_warehouse ?? false,
                            autoWarehouseTrigger: raw.auto_warehouse_trigger ?? 90
                        })
                    }
                }
            } catch (error) {
                console.error('Failed to load construction data', error)
                toast.error('Erro ao carregar dados')
            }
        }
        loadData()
    }, [user?.uuid])

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isImportModalOpen, setIsImportModalOpen] = useState(false)
    const [importText, setImportText] = useState('')
    const [editingModel, setEditingModel] = useState<ConstructionModel | null>(null)
    const [queue, setQueue] = useState<QueueItem[]>([])
    const [modelName, setModelName] = useState('')

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [modelToDelete, setModelToDelete] = useState<string | null>(null)

    // Reset queue and name when modal opens
    useEffect(() => {
        if (!isModalOpen) {
            setQueue([])
            setModelName('')
        }
    }, [isModalOpen])

    const handleSaveModel = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!modelName.trim()) return toast.error('Nome do modelo é obrigatório')
        if (queue.length === 0) return toast.error('Adicione pelo menos uma construção à ordem')

        const modelToSave = {
            ...(editingModel ? { uuid: editingModel.uuid } : {}),
            name: modelName,
            buildingOrder: queue.map(item => item.code)
        }

        try {
            const result = await (window as any).ipcRenderer.invoke('construction:save-model', {
                userUuid: user.uuid,
                model: modelToSave
            })

            if (result.success) {
                toast.success('Modelo salvo com sucesso')
                setIsModalOpen(false)
                // Refresh models
                const modelsResult = await (window as any).ipcRenderer.invoke('construction:get-models', user.uuid)
                if (modelsResult.success) {
                    setModels(modelsResult.models)
                }
            } else {
                toast.error('Erro ao salvar: ' + result.error)
            }
        } catch (error) {
            console.error(error)
            toast.error('Erro ao salvar modelo')
        }
    }

    const handleSaveSettings = async () => {
        try {
            // Clean settings before sending
            const settingsToSave = {
                construction: settings
            }

            const result = await (window as any).ipcRenderer.invoke('construction:save-settings', {
                userUuid: user.uuid,
                settings: settingsToSave
            })

            if (result.success) {
                if (result.user) updateUser(result.user)
                toast.success('Configurações salvas')
            } else {
                toast.error('Erro ao salvar opções')
            }
        } catch (error) {
            console.error(error)
            toast.error('Erro ao salvar configurações')
        }
    }

    const openEdit = (model: ConstructionModel) => {
        setEditingModel(model)
        setModelName(model.name)
        setQueue(model.buildingOrder.map(code => ({ id: uid(), code })))
        setIsModalOpen(true)
    }

    const openNew = () => {
        setEditingModel(null)
        setModelName('')
        setQueue([])
        setIsModalOpen(true)
    }

    const handleDelete = (id: string) => {
        setModelToDelete(id)
        setShowDeleteModal(true)
    }

    const confirmDelete = async () => {
        if (!modelToDelete) return

        try {
            const result = await (window as any).ipcRenderer.invoke('construction:delete-model', {
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

    const queueEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll when adding items
    useEffect(() => {
        if (isModalOpen && queueEndRef.current) {
            queueEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [queue.length, isModalOpen])

    const addToQueue = (buildingKey: string) => {
        // Check Max Level
        const currentCount = queue.filter(i => i.code === buildingKey).length
        const buildingInfo = (buildingsData as any)[buildingKey]
        const maxLevel = buildingInfo ? Object.keys(buildingInfo).length : 20

        if (currentCount >= maxLevel) {
            return toast.error(`${buildingKey} já atingiu o nível máximo (${maxLevel})`)
        }

        setQueue(prev => [...prev, { id: uid(), code: buildingKey }])
    }

    const removeFromQueue = (id: string) => {
        setQueue(prev => prev.filter(item => item.id !== id))
    }

    const handleReorder = (newOrder: QueueItem[]) => {
        setQueue(newOrder)
    }



    const calculateStats = (currentQueue: QueueItem[]) => {
        let totalPoints = 0
        let totalPop = 0
        const counts: Record<string, number> = {}

        for (const item of currentQueue) {
            counts[item.code] = (counts[item.code] || 0) + 1
            const level = counts[item.code]
            const info = (buildingsData as any)[item.code]
            if (info && info[String(level)]) {
                totalPoints += info[String(level)].points
                totalPop += info[String(level)].pop
            }
        }
        return { totalPoints, totalPop }
    }

    const calculateModelStats = (order: string[]) => {
        let totalPoints = 0
        let totalPop = 0
        const counts: Record<string, number> = {}

        for (const code of order) {
            counts[code] = (counts[code] || 0) + 1
            const level = counts[code]
            const info = (buildingsData as any)[code]
            if (info && info[String(level)]) {
                totalPoints += info[String(level)].points
                totalPop += info[String(level)].pop
            }
        }
        return { totalPoints, totalPop }
    }

    const handleImport = () => {
        try {
            // Simple format expected: "main:20,barracks:5" or JSON
            let newQueue: string[] = []

            if (importText.trim().startsWith('[')) {
                // Try JSON array
                newQueue = JSON.parse(importText)
            } else if (importText.includes(':')) {
                // Parse format "main:5,storage:10"
                const parts = importText.split(',')
                for (const part of parts) {
                    const [b, lvl] = part.split(':').map(s => s.trim())
                    if (b && lvl && AVAILABLE_BUILDINGS.includes(b)) {
                        const count = parseInt(lvl)
                        for (let i = 0; i < count; i++) newQueue.push(b)
                    }
                }
            } else {
                // Try Base64 Legacy Format
                try {
                    const decoded = atob(importText.trim());
                    let i = 2; // skip first 2 bytes
                    console.log('Decoded length:', decoded.length);

                    while (i < decoded.length) {
                        const buildingCode = decoded.charCodeAt(i);
                        const levels = decoded.charCodeAt(i + 1);

                        if (levels === 244) break; // EOF marker

                        if (buildingCode >= 0 && buildingCode < BUILDING_CODES_LEGACY.length && levels > 0) {
                            const buildingName = BUILDING_CODES_LEGACY[buildingCode];
                            for (let k = 0; k < levels; k++) {
                                newQueue.push(buildingName);
                            }
                        }
                        i += 2;
                    }
                } catch (e) {
                    console.warn('Failed to parse as base64 legacy', e);
                    throw new Error('Formato desconhecido');
                }
            }

            if (Array.isArray(newQueue) && newQueue.length > 0) {
                setQueue(newQueue.map(code => ({ id: uid(), code })))
                setIsImportModalOpen(false)
                setImportText('')
                toast.success('Modelo importado com sucesso!')
            } else {
                toast.error('Nenhuma construção encontrada')
            }
        } catch (e) {
            console.error(e);
            toast.error('Erro ao importar: Formato inválido')
        }
    }

    const fileInputRef = useRef<HTMLInputElement>(null)

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

                // Show loading toast?
                const loadingToast = toast.loading('Importando modelos...')

                for (const model of importedModels) {
                    if (!model.name || !model.buildings) continue // Skip invalid items

                    // User script format usually has "buildings": [["main", 20], ...]
                    // Our format expects "buildingOrder": ["main", "main", ...]

                    let convertedOrder: string[] = []

                    // Check if it matches user script format
                    if (Array.isArray(model.buildings) && Array.isArray(model.buildings[0])) {
                        const currentLevels: Record<string, number> = {}
                        for (const [bName, bLevel] of model.buildings) {
                            // This is actually cumulative target level in user script? 
                            // Wait, user script: imported.push([building, lastLevel + levels]);
                            // The JSON usually stores THE TARGET LEVEL directly?
                            // Example: [["main", 10], ["statue", 1]]
                            // If "main" 10 means target level 10.
                            // But our system is queue based (step-by-step).
                            // We need to convert "Target 10" to 10 entries of "main"?
                            // NO. The user script's logic: 
                            // `imported.push([building, lastLevel + levels]);`
                            // It tracks cumulative.

                            // BUT, if we are importing the `savedModels` from LOCAL STORAGE of user script:
                            // User script: `storage.set('savedModels', models);`
                            // `loadCustomModels` reads it.
                            // The format IS `[{name: "...", buildings: [["main", 10], ...]}]`

                            // I must convert the User Script format (Cumulative Levels) to Simple Queue (Repeated Names) for the frontend UI.

                            // Algorithm:
                            // Current simulated levels: { main: 0, barracks: 0 ... }
                            // Iterate input: ["main", 10]
                            // Needed: 10 - 0 = 10 "main"s.
                            // Next: ["main", 15]
                            // Needed: 15 - 10 = 5 "main"s.

                            const count = Number(bLevel)
                            const current = currentLevels[bName] || 0
                            const needed = count - current

                            if (needed > 0) {
                                for (let k = 0; k < needed; k++) convertedOrder.push(String(bName))
                                currentLevels[bName] = count
                            }
                        }
                    } else if (Array.isArray(model.buildingOrder)) {
                        // Already in our format
                        convertedOrder = model.buildingOrder
                    } else {
                        // Fallback or skip
                        continue;
                    }

                    if (convertedOrder.length > 0) {
                        const result = await (window as any).ipcRenderer.invoke('construction:save-model', {
                            userUuid: user.uuid,
                            model: {
                                name: model.name,
                                buildingOrder: convertedOrder,
                                // Default settings
                                auto_farm: false,
                                auto_warehouse: false,
                                auto_farm_level_trigger: 90,
                                auto_warehouse_trigger: 90
                            }
                        })
                        if (result.success) successCount++
                    }
                }

                toast.dismiss(loadingToast)
                toast.success(`${successCount} modelos importados!`)

                // Refresh
                const modelsResult = await (window as any).ipcRenderer.invoke('construction:get-models', user.uuid)
                if (modelsResult.success) {
                    setModels(modelsResult.models)
                }

            } catch (err) {
                console.error(err)
                toast.error('Erro ao processar arquivo')
            }
        }
        reader.readAsText(file)

        // Reset input
        e.target.value = ''
    }

    const handleExport = () => {
        try {
            const dataStr = JSON.stringify(models, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `construction_models_${new Date().toISOString().slice(0, 10)}.json`;
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

    return (
        <div className="h-full flex flex-col gap-6 pb-6">
            {/* Section 1: Settings */}
            <ScriptSettingsCard
                title="Opções de Construção"
                description="Defina os parâmetros globais do construtor."
            >
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Max Queues */}
                        <div className="bg-[#111113] rounded-2xl p-6 border border-white/5 flex flex-col justify-between h-full">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#18181b] flex items-center justify-center border border-white/5 shrink-0">
                                    <ListOrdered className="w-5 h-5 text-zinc-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-bold text-white mb-1">Filas Simultâneas</h3>
                                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                                        Construções por aldeia ao mesmo tempo.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <input
                                    type="number"
                                    value={settings.maxQueues}
                                    onChange={(e) => setSettings({ ...settings, maxQueues: parseInt(e.target.value) || 2 })}
                                    className="w-full bg-[#18181b] border border-white/5 rounded-xl py-3 px-4 text-center text-white text-xl font-bold outline-none focus:border-white/10 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    min="1"
                                    max="5"
                                />
                            </div>
                        </div>

                        {/* Auto Farm */}
                        <div className={`bg-[#09090b] rounded-2xl p-6 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full ${settings.autoFarm ? 'border-emerald-500/20' : 'border-emerald-500/10'}`}>

                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={BUILDING_IMAGES['farm']} alt="Fazenda" className="w-8 h-8 object-contain" />
                                    <h3 className="text-base font-bold text-white">Auto Evoluir Fazenda</h3>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.autoFarm ?? false}
                                        onChange={(e) => setSettings({ ...settings, autoFarm: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>

                            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                                Construir fazenda automaticamente, se a população restante disponível for inferior a
                                <span className="text-emerald-500 text-xs font-bold mx-1">{settings.autoFarmLevelTrigger ?? 5}%.</span>
                            </p>

                            <div className="mt-auto">
                                <div className="flex items-center gap-2 bg-[#18181b] p-1.5 rounded-xl border border-white/5 w-fit">
                                    <input
                                        type="number"
                                        value={settings.autoFarmLevelTrigger ?? 5}
                                        onChange={(e) => setSettings({ ...settings, autoFarmLevelTrigger: parseInt(e.target.value) || 5 })}
                                        className="w-12 bg-transparent text-center text-white text-sm font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="text-xs text-zinc-500 font-bold px-2 border-l border-white/5">%</span>
                                </div>
                            </div>
                        </div>

                        {/* Auto Warehouse */}
                        <div className={`bg-[#09090b] rounded-2xl p-6 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full ${settings.autoWarehouse ? 'border-emerald-500/20' : 'border-emerald-500/10'}`}>

                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={BUILDING_IMAGES['storage']} alt="Armazém" className="w-8 h-8 object-contain" />
                                    <h3 className="text-base font-bold text-white">Auto Evoluir Armazém</h3>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.autoWarehouse ?? false}
                                        onChange={(e) => setSettings({ ...settings, autoWarehouse: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>

                            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                                Se a soma dos três recursos ultrapassarem <span className="text-emerald-500 font-bold mx-1">{settings.autoWarehouseTrigger ?? 90}%</span> do armazém, constrói +1 nível automaticamente.
                            </p>

                            <div className="mt-auto">
                                <div className="flex items-center gap-2 bg-[#18181b] p-1.5 rounded-xl border border-white/5 w-fit">
                                    <input
                                        type="number"
                                        value={settings.autoWarehouseTrigger ?? 90}
                                        onChange={(e) => setSettings({ ...settings, autoWarehouseTrigger: parseInt(e.target.value) || 90 })}
                                        className="w-12 bg-transparent text-center text-white text-sm font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="text-xs text-zinc-500 font-bold px-2 border-l border-white/5">%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSaveSettings}
                            className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs tracking-wider px-6 py-3 rounded-lg shadow-lg shadow-emerald-500/10 transition-all flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" /> SALVAR CONFIGURAÇÕES
                        </button>
                    </div>
                </div>
            </ScriptSettingsCard>

            {/* Section 2: Manage Models */}
            <ScriptSection
                title="Modelos de Construção"
                subtitle="Crie filas de construção pré-definidas."
                icon={Hammer}
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
                        const { totalPoints, totalPop } = calculateModelStats(model.buildingOrder)
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
                                        <div className="flex items-center gap-2" title="Pontuação Total">
                                            <div className="p-1.5 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                                <span className="text-yellow-500 font-black text-xs">PTS</span>
                                            </div>
                                            <span className="text-white font-bold text-sm">{totalPoints.toLocaleString()}</span>
                                        </div>

                                        <div className="flex items-center gap-2" title="População Utilizada">
                                            <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                                <span className="text-blue-500 font-black text-xs">POP</span>
                                            </div>
                                            <span className="text-white font-bold text-sm">{totalPop.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {AVAILABLE_BUILDINGS.map(building => {
                                            const count = model.buildingOrder.filter(b => b === building).length
                                            return (
                                                <div key={building} className="flex flex-col items-center gap-1 bg-[#18181b]/50 border border-white/5 p-2 rounded-xl min-w-[60px]">
                                                    <div className="relative">
                                                        {BUILDING_IMAGES[building] && <img src={BUILDING_IMAGES[building]} alt={building} className="w-12 h-12 object-contain filter drop-shadow-lg" />}
                                                        <div className="absolute -bottom-1 -right-2 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md border border-[#18181b] shadow-sm bg-emerald-600">
                                                            {count}
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
                        <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-2xl">
                            <p className="text-zinc-500 font-medium text-sm">Nenhum modelo criado ainda.</p>
                        </div>
                    )}
                </div>
            </ScriptSection>

            {/* Modal */}
            < Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingModel ? 'Editar Modelo' : 'Criar Novo Modelo'}
                maxWidth="max-w-[95vw] md:max-w-6xl"
            >
                <form onSubmit={handleSaveModel} className="p-6 h-[80vh] flex flex-col bg-[#111111]">
                    <div className="mb-4 flex gap-3 items-end">
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Nome do Modelo</label>
                            <input
                                type="text"
                                value={modelName}
                                onChange={e => setModelName(e.target.value)}
                                placeholder="Ex: Evolução Inicial"
                                className="w-full bg-[#27272a] border border-white/10 rounded-xl py-2.5 px-3 text-white outline-none focus:border-emerald-600 font-medium text-base"
                                autoFocus
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsImportModalOpen(true)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/5 px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 mb-[1px] text-sm"
                        >
                            Importar
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col gap-4 min-h-0">
                        {/* Top: Available Buildings */}
                        <div className="bg-[#18181b]/50 rounded-xl p-4 border border-white/5 shrink-0">
                            <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-3">
                                Adicionar Construção
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {AVAILABLE_BUILDINGS.map((key) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => addToQueue(key)}
                                        className="w-16 h-16 bg-[#27272a] border border-white/5 rounded-xl flex items-center justify-center hover:border-emerald-600 hover:bg-emerald-600/10 transition-all cursor-pointer group relative"
                                        title={key}
                                    >
                                        {BUILDING_IMAGES[key] && <img src={BUILDING_IMAGES[key]} alt={key} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />}
                                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] text-zinc-400 font-bold">
                                            {queue.filter(i => i.code === key).length}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bottom: Queue */}
                        <div className="flex-1 bg-[#18181b]/50 rounded-xl p-3 border border-white/5 flex flex-col min-h-0">
                            <div className="flex items-center justify-between mb-3 bg-[#18181b] py-2 px-2 rounded-lg border border-white/5 shrink-0">
                                <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                                    Fila de Construção ({queue.length})
                                </h4>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded border border-white/5">
                                        Pontuação Total: <span className="text-emerald-400 font-bold">{calculateStats(queue).totalPoints}</span>
                                    </span>
                                    <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded border border-white/5">
                                        População: <span className="text-amber-500 font-bold">{calculateStats(queue).totalPop}</span>
                                    </span>
                                    {queue.length > 0 && (
                                        <div className="w-px h-3 bg-white/10 mx-1"></div>
                                    )}
                                    {queue.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setQueue([])}
                                            className="text-[10px] text-red-500 hover:text-red-400 font-bold hover:underline cursor-pointer"
                                        >
                                            Limpar
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-1.5 relative custom-scrollbar">
                                <Reorder.Group axis="y" values={queue} onReorder={handleReorder} className="space-y-1.5">
                                    {queue.map((item, index) => (
                                        <Reorder.Item
                                            key={item.id}
                                            value={item}
                                            className="flex items-center gap-3 bg-[#27272a] p-2.5 rounded-lg border border-white/5 group hover:border-white/10 transition-colors cursor-move"
                                        >
                                            <div className="text-zinc-600 cursor-grab active:cursor-grabbing">
                                                <GripVertical className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-mono text-zinc-500 select-none">
                                                {index + 1}
                                            </div>
                                            {BUILDING_IMAGES[item.code] && <img src={BUILDING_IMAGES[item.code]} alt={item.code} className="w-10 h-10 object-contain select-none" />}
                                            <div className="flex-1">
                                                <span className="text-xs font-bold text-white capitalize select-none">{item.code}</span>
                                                <span className="text-[10px] text-zinc-500 ml-2 select-none">
                                                    (Nível {queue.filter((q, i) => q.code === item.code && i <= index).length})
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    // Prevent drag start
                                                    e.stopPropagation();
                                                    removeFromQueue(item.id);
                                                }}
                                                className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>

                                <div ref={queueEndRef} />

                                {queue.length === 0 && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 gap-3 opacity-50 pointer-events-none">
                                        <ArrowUp className="w-6 h-6 animate-bounce" />
                                        <p className="text-xs">Selecione as construções acima para adicionar à fila.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-3 justify-end pt-4 border-t border-white/5">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 font-bold text-xs transition-all cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                        >
                            Salvar Modelo
                        </button>
                    </div>
                </form>
            </Modal >

            {/* Import Modal */}
            < Modal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                title="Importar Modelo"
                maxWidth="max-w-xl"
            >
                <div className="p-6 bg-[#111111]">
                    <p className="text-xs text-zinc-400 mb-4">
                        Cole o código do modelo abaixo. Aceita formato JSON ou lista simplificada (ex: "main:20, barracks:5").
                    </p>
                    <textarea
                        value={importText}
                        onChange={e => setImportText(e.target.value)}
                        className="w-full h-32 bg-[#27272a] border border-white/10 rounded-xl p-3 text-white text-xs font-mono outline-none focus:border-emerald-600 mb-4"
                        placeholder='{"main": 20, "barracks": 5}'
                    ></textarea>
                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={() => setIsImportModalOpen(false)}
                            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 font-bold text-xs transition-all cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleImport}
                            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white font-bold text-xs shadow-lg shadow-black/20 transition-all cursor-pointer"
                        >
                            Importar
                        </button>
                    </div>
                </div>
            </Modal >
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Remover Modelo"
                message="Tem certeza que deseja remover este modelo de construção? Esta ação não pode ser desfeita."
                confirmText="Remover"
                variant="danger"
            />
        </div >
    )
}

export default ConstructionConfig
