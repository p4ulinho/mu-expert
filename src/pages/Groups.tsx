import React, { useState, useEffect, useMemo } from 'react'
import {
    Tags,
    Plus,
    Trash2,
    Search,
    CheckSquare,
    Square,
    ChevronRight,
    Palette,
    Save,
    LayoutGrid,
    RefreshCw,
    X,
    Check
} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import ConfirmationModal from '../components/ConfirmationModal'
import { getServerInfo } from '../utils/servers'
import { CustomSelect } from '../components/ui/CustomSelect'


interface GroupsProps {
    userUuid: string
    user: any
    updateUser: (user: any) => void
}

const PREDEFINED_COLORS = [
    { name: 'Emerald', value: '#10b981' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Zinc', value: '#71717a' },
]

const Groups: React.FC<GroupsProps> = ({ userUuid, user, updateUser }) => {
    const [accounts, setAccounts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
    const [groupColors, setGroupColors] = useState<Record<string, string>>({})
    const [accountGroups, setAccountGroups] = useState<string[]>([])

    // UI State
    const [newGroupName, setNewGroupName] = useState('')
    const [selectedColor, setSelectedColor] = useState(PREDEFINED_COLORS[0].value)
    const [selectedGroupForAssign, setSelectedGroupForAssign] = useState<string>('')
    const [editingGroup, setEditingGroup] = useState<string | null>(null)
    const [editName, setEditName] = useState('')
    const [editColor, setEditColor] = useState('')
    const [groupToDelete, setGroupToDelete] = useState<string | null>(null)

    useEffect(() => {
        fetchAccounts()
        if (user?.preferences) {
            setAccountGroups(user.preferences.accountGroups || [])
            setGroupColors(user.preferences.groupColors || {})
        }
    }, [user])

    const fetchAccounts = async () => {
        setIsLoading(true)
        try {
            const result = await (window as any).ipcRenderer.invoke('accounts:get-all', userUuid)
            if (result.success) {
                setAccounts(result.accounts)
            }
        } catch (error) {
            console.error('Error fetching accounts:', error)
            toast.error('Erro ao carregar contas')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddGroup = async () => {
        if (!newGroupName.trim()) return
        if (accountGroups.includes(newGroupName.trim())) {
            toast.error('Este grupo já existe')
            return
        }

        const newGroups = [...accountGroups, newGroupName.trim()]
        const newColors = { ...groupColors, [newGroupName.trim()]: selectedColor }

        await updateGroupsOnBackend(newGroups, newColors)
        setNewGroupName('')
    }

    const handleDeleteGroup = async (groupName: string) => {

        const newGroups = accountGroups.filter(g => g !== groupName)
        const newColors = { ...groupColors }
        delete newColors[groupName]

        await updateGroupsOnBackend(newGroups, newColors)

        try {
            await (window as any).ipcRenderer.invoke('accounts:bulk-update-group', userUuid, {
                targetGroup: groupName,
                newGroup: ''
            })
            fetchAccounts()
        } catch (error) {
            console.error('Error removing group from accounts:', error)
        }
    }

    const handleStartEdit = (group: string) => {
        setEditingGroup(group)
        setEditName(group)
        setEditColor(groupColors[group] || PREDEFINED_COLORS[0].value)
    }

    const handleSaveEdit = async () => {
        if (!editingGroup || !editName.trim()) return

        let newGroups = [...accountGroups]
        let newColors = { ...groupColors }

        if (editName !== editingGroup) {
            if (accountGroups.includes(editName.trim())) {
                toast.error('Já existe um grupo com este nome')
                return
            }
            newGroups = accountGroups.map(g => g === editingGroup ? editName.trim() : g)
            delete newColors[editingGroup]

            // Update accounts in background
            try {
                await (window as any).ipcRenderer.invoke('accounts:bulk-update-group', userUuid, {
                    targetGroup: editingGroup,
                    newGroup: editName.trim()
                })
            } catch (e) { console.error(e) }
        }

        newColors[editName.trim()] = editColor
        await updateGroupsOnBackend(newGroups, newColors)
        setEditingGroup(null)
        fetchAccounts()
    }

    const updateGroupsOnBackend = async (groups: string[], colors: Record<string, string>) => {
        try {
            const result = await (window as any).ipcRenderer.invoke('user:update-preferences', {
                uuid: userUuid,
                preferences: {
                    accountGroups: groups,
                    groupColors: colors
                }
            })
            if (result.success) {
                setAccountGroups(groups)
                setGroupColors(colors)
                updateUser({
                    ...user,
                    preferences: {
                        ...user.preferences,
                        accountGroups: groups,
                        groupColors: colors
                    }
                })
                toast.success('Grupos salvos com sucesso!')
            }
        } catch (error) {
            console.error('Error updating groups:', error)
            toast.error('Erro ao salvar grupos')
        }
    }

    const handleBulkAssign = async (groupToSet: string) => {
        if (selectedAccounts.length === 0) {
            toast.error('Selecione ao menos uma conta')
            return
        }

        try {
            const result = await (window as any).ipcRenderer.invoke('accounts:bulk-update', userUuid, {
                accountIds: selectedAccounts,
                updateData: { group: groupToSet }
            })

            if (result.success) {
                toast.success(`${selectedAccounts.length} contas ${groupToSet ? `movidas para "${groupToSet}"` : 'desvinculadas'}`)
                setSelectedAccounts([])
                fetchAccounts()
            } else {
                toast.error(result.error || 'Erro ao atualizar contas')
            }
        } catch (error: any) {
            console.error('Error bulk assigning group:', error)
            toast.error(error.message || 'Erro ao conectar com o servidor')
        }
    }

    const filteredAccounts = useMemo(() => {
        return accounts.filter(acc =>
            acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            acc.group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            acc.server?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [accounts, searchTerm])

    const toggleAccountSelection = (id: string) => {
        setSelectedAccounts(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        )
    }

    // Keyboard Shortcuts (Moved here to avoid use-before-declaration error)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+A: Select All Filtered
            if (e.ctrlKey && e.key.toLowerCase() === 'a') {
                e.preventDefault()
                if (selectedAccounts.length === filteredAccounts.length && filteredAccounts.length > 0) {
                    setSelectedAccounts([])
                } else {
                    setSelectedAccounts(filteredAccounts.map(acc => acc._id))
                }
            }
            // Ctrl+F: Focus Search
            if (e.ctrlKey && e.key.toLowerCase() === 'f') {
                e.preventDefault()
                document.getElementById('group-search')?.focus()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [filteredAccounts, selectedAccounts])

    const selectAllFiltered = () => {
        if (selectedAccounts.length === filteredAccounts.length && filteredAccounts.length > 0) {
            setSelectedAccounts([])
        } else {
            setSelectedAccounts(filteredAccounts.map(a => a._id))
        }
    }

    return (
        <div className="flex flex-col h-full gap-6 font-['Outfit'] antialiased text-zinc-200">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        <Tags className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">Gestão de Grupos</h1>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none mt-1">Organize e gerencie rótulos para suas contas</p>
                    </div>
                </div>

                <button
                    onClick={fetchAccounts}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer group"
                >
                    <RefreshCw className={`w-5 h-5 group-active:rotate-180 transition-transform duration-500 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                {/* Left Sidebar: Groups Panel */}
                <div className="lg:col-span-4 flex flex-col gap-4 min-h-0">
                    <div className="bg-[#121214]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col gap-6 flex-1 min-h-0">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 italic">
                                    <Palette className="w-4 h-4 text-emerald-500" /> Meus Grupos
                                </h2>
                                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1 font-['Inter']">Categorias Personalizadas</p>
                            </div>
                        </div>

                        {/* Add Group Section */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nome do novo grupo..."
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500/50 transition-all"
                                />
                                <button
                                    onClick={handleAddGroup}
                                    className="p-2.5 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Color Selector */}
                            <div className="flex flex-wrap gap-2 justify-center">
                                {PREDEFINED_COLORS.map(color => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.value)}
                                        className={`w-6 h-6 rounded-full border-2 transition-all transform hover:scale-125 cursor-pointer ${selectedColor === color.value ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Groups List Scrollable */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-2">
                            {accountGroups.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-20 border-2 border-dashed border-white/5 rounded-3xl">
                                    <Tags className="w-12 h-12 mb-2" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Nenhum grupo criado</p>
                                </div>
                            ) : (
                                accountGroups.map((group) => (
                                    <motion.div
                                        key={group}
                                        layout
                                        className={`group relative flex items-center justify-between p-3 rounded-2xl border transition-all ${editingGroup === group ? 'bg-white/10 border-emerald-500/50' : 'bg-white/5 border-white/5 hover:bg-white-[0.07] hover:border-white/10'}`}
                                    >
                                        {editingGroup === group ? (
                                            <div className="flex flex-col w-full gap-3">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        autoFocus
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50"
                                                    />
                                                    <button onClick={handleSaveEdit} className="p-1.5 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400">
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => setEditingGroup(null)} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {PREDEFINED_COLORS.map(c => (
                                                        <button
                                                            key={c.name}
                                                            onClick={() => setEditColor(c.value)}
                                                            className={`w-4 h-4 rounded-full border border-white/20 cursor-pointer ${editColor === c.value ? 'scale-125 border-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                                                            style={{ backgroundColor: c.value }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-3.5 h-3.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] border border-white/10"
                                                        style={{ backgroundColor: groupColors[group] || '#71717a' }}
                                                    />
                                                    <span className="text-xs font-bold text-gray-200">{group}</span>
                                                </div>

                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                    <button
                                                        onClick={() => handleStartEdit(group)}
                                                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-emerald-400 transition-all cursor-pointer"
                                                        title="Editar"
                                                    >
                                                        <Palette className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setGroupToDelete(group)}
                                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Account Assignment */}
                <div className="lg:col-span-8 flex flex-col gap-4 min-h-0">
                    <div className="bg-[#121214]/50 backdrop-blur-xl border border-white/5 rounded-3xl flex flex-col min-h-0 flex-1 overflow-hidden shadow-2xl">

                        {/* Search & Selection Info */}
                        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-b from-white/[0.02] to-transparent">
                            <div className="relative group flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-emerald-500 transition-colors" />
                                <input
                                    id="group-search"
                                    type="text"
                                    placeholder="Buscar por nome, servidor ou grupo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600 font-medium"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none font-['Inter']">Selecionadas</span>
                                    <span className="text-xl font-black italic text-emerald-500 leading-none mt-1 shadow-sm">
                                        {selectedAccounts.length}
                                    </span>
                                </div>
                                <button
                                    onClick={selectAllFiltered}
                                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${selectedAccounts.length === filteredAccounts.length && filteredAccounts.length > 0 ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
                                    title="Alternar Seleção Total"
                                >
                                    {selectedAccounts.length === filteredAccounts.length && filteredAccounts.length > 0 ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Bulk Action Bar - Sticky/Header-like */}
                        <div className="px-6 py-4 bg-black/60 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 z-20 relative">
                            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                                <div className="flex items-center gap-2 group">
                                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                        <ChevronRight className="w-3 h-3 text-emerald-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Mover para:</span>
                                </div>
                                <div className="flex-1 max-w-[300px]">
                                    <CustomSelect
                                        value={selectedGroupForAssign}
                                        onChange={(val: any) => setSelectedGroupForAssign(val)}
                                        options={accountGroups.map(g => ({
                                            label: g,
                                            value: g,
                                            color: groupColors[g]
                                        }))}
                                        placeholder="Selecione um grupo..."
                                        borderColor="border-white/10 hover:border-emerald-500/50"
                                        renderOption={(option: any) => (
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-2 h-2 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)]"
                                                    style={{ backgroundColor: option.color || '#71717a' }}
                                                />
                                                <span>{option.label}</span>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleBulkAssign('')}
                                    disabled={selectedAccounts.length === 0}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedAccounts.length > 0
                                        ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 cursor-pointer'
                                        : 'bg-white/5 text-gray-600 border-white/5 cursor-not-allowed grayscale'
                                        }`}
                                >
                                    <Trash2 className="w-4 h-4" /> Desvincular de Tudo
                                </button>
                                <button
                                    onClick={() => handleBulkAssign(selectedGroupForAssign)}
                                    disabled={selectedAccounts.length === 0 || !selectedGroupForAssign}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_8px_25px_-10px_rgba(16,185,129,0.5)] active:scale-95 ${selectedAccounts.length > 0 && selectedGroupForAssign
                                        ? 'bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-[0_8px_30px_-5px_rgba(16,185,129,0.6)] cursor-pointer'
                                        : 'bg-white/5 text-gray-600 cursor-not-allowed grayscale shadow-none'
                                        }`}
                                >
                                    <Save className="w-4 h-4" /> Aplicar Grupo
                                </button>
                            </div>
                        </div>

                        {/* Accounts Grid */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gradient-to-t from-black/40 to-transparent">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                {filteredAccounts.length === 0 ? (
                                    <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5 text-gray-700">
                                            <LayoutGrid className="w-10 h-10 opacity-10" />
                                        </div>
                                        <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.3em]">Nenhuma conta encontrada</h3>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold max-w-[200px] leading-relaxed">Tente ajustar sua busca ou selecione outros critérios de filtro.</p>
                                    </div>
                                ) : (
                                    filteredAccounts.map((acc, idx) => {
                                        const isSelected = selectedAccounts.includes(acc._id)
                                        const groupColor = groupColors[acc.group] || '#71717a'

                                        // Flag and Server Info using centralized logic
                                        const { flagUrl, sigla } = getServerInfo(acc)

                                        return (
                                            <motion.div
                                                key={acc._id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: Math.min(idx * 0.015, 0.3) }}
                                                onClick={() => toggleAccountSelection(acc._id)}
                                                className={`group relative flex items-center gap-4 p-3 rounded-2xl border transition-all cursor-pointer ${isSelected
                                                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_12px_30px_-10px_rgba(16,185,129,0.2)]'
                                                    : 'bg-[#1a1a1e]/40 border-white/5 hover:border-white/10 hover:bg-[#1a1a1e]/60 shadow-lg'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${isSelected ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-black/40 border-white/10 text-transparent'}`}>
                                                        <Check className="w-3.5 h-3.5 stroke-[4px]" />
                                                    </div>
                                                    <img
                                                        src={flagUrl}
                                                        alt={sigla}
                                                        className="w-8 h-6 object-cover rounded-lg shadow-md border border-white/10"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                                                    <div className="flex flex-col min-w-0">
                                                        <span className={`text-[12px] font-bold uppercase tracking-wider truncate transition-colors ${isSelected ? 'text-white' : 'text-zinc-200'} font-['Outfit']`}>
                                                            {acc.name}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 opacity-60">
                                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-none font-['Inter']">{sigla}</span>
                                                        </div>
                                                    </div>

                                                    <div className="shrink-0">
                                                        {acc.group ? (
                                                            <div
                                                                className="px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-[0.1em] shadow-sm"
                                                                style={{
                                                                    backgroundColor: `${groupColor}10`,
                                                                    borderColor: `${groupColor}30`,
                                                                    color: groupColor
                                                                }}
                                                            >
                                                                {acc.group}
                                                            </div>
                                                        ) : (
                                                            <div className="w-2 h-2 rounded-full bg-white/5 border border-white/5" />
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Confirmation Modal for deletion */}
            <ConfirmationModal
                isOpen={!!groupToDelete}
                onClose={() => setGroupToDelete(null)}
                onConfirm={() => groupToDelete && handleDeleteGroup(groupToDelete)}
                title="Excluir Grupo"
                message={`Tem certeza que deseja excluir o grupo "${groupToDelete}"? Esta ação desvinculará todas as contas deste grupo.`}
                confirmText="Excluir"
                variant="danger"
            />
        </div>
    )
}

export default Groups
