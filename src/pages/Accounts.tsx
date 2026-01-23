import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Search, Plus, Trash2, Play, Pause, X, Settings, Loader2, Globe, Clock, Activity, User, Tags, LayoutGrid, Users, Crown, Trophy, Filter, LogIn, MoreHorizontal, Pencil, Save, Info, ChevronDown, Hammer, Package, RefreshCw, ShieldAlert, ScanFace, CheckCircle2, Shield, Bug, Eye, EyeOff, MessageSquare } from 'lucide-react'
import { CustomSelect } from '../components/ui/CustomSelect'
import ConfirmationModal from '../components/ConfirmationModal'
import Modal from '../components/Modal'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

import { getServerInfo, SERVER_DATA, getFlagAsset } from '../utils/servers'
import { Tooltip } from '../components/Tooltip'

interface AccountsProps {
    userUuid: string
    user?: any
    navigateToTab?: (tab: string) => void
}


import storagePng from '../assets/buildings/storage.png'

const unitAssets = import.meta.glob('../assets/units/*.webp', { eager: true, query: '?url', import: 'default' })



const getUnitAsset = (name: string) => {
    const path = `../assets/units/${name}.webp`
    return (unitAssets[path] as string) || ''
}

const ASSETS = {
    units: {
        spear: getUnitAsset('spear'),
        sword: getUnitAsset('sword'),
        spy: getUnitAsset('spy'),
        light: getUnitAsset('light'),
        att: getUnitAsset('att')
    },
    res: {
        wood: 'https://dsbr.innogamescdn.com/asset/fc339a06/graphic/holz.png',
        stone: 'https://dsbr.innogamescdn.com/asset/fc339a06/graphic/lehm.png',
        iron: 'https://dsbr.innogamescdn.com/asset/fc339a06/graphic/eisen.png',
        storage: storagePng
    },
    farm: 'https://dsbr.innogamescdn.com/asset/fc339a06/graphic/face.png'
}

const formatNumber = (num: number | undefined) => {
    return num ? num.toLocaleString('pt-BR') : '0'
}

const Accounts: React.FC<AccountsProps> = ({ userUuid, user, navigateToTab }) => {
    // Default Server Constant
    const DEFAULT_SERVER = SERVER_DATA['tribalwars.com.br'].domain

    const [accounts, setAccounts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [userProxies, setUserProxies] = useState<any[]>([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [isBulkLoggingIn, setIsBulkLoggingIn] = useState(false)
    const [isStopping, setIsStopping] = useState(false)
    const stopBulkRef = React.useRef(false)
    const [groupColors, setGroupColors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (user?.preferences?.groupColors) {
            setGroupColors(user.preferences.groupColors)
        }
    }, [user])

    const handleUpdateGroupColor = async (group: string, color: string) => {
        const newColors = { ...groupColors, [group]: color }
        setGroupColors(newColors)

        try {
            await (window as any).ipcRenderer.invoke('user:update-preferences', {
                uuid: userUuid,
                preferences: {
                    groupColors: newColors
                }
            })
            toast.success(`Cor do grupo ${group} atualizada!`)
        } catch (error) {
            console.error('Error updating group color:', error)
            toast.error('Erro ao salvar cor do grupo.')
        }
    }
    const [searchTerm, setSearchTerm] = useState('')
    const [bulkConcurrency, setBulkConcurrency] = useState(() => {
        const saved = localStorage.getItem('multi_expert_bulk_concurrency')
        return saved ? Number(saved) : 1
    })

    useEffect(() => {
        localStorage.setItem('multi_expert_bulk_concurrency', bulkConcurrency.toString())
    }, [bulkConcurrency])

    const [availableWorlds, setAvailableWorlds] = useState<Record<string, string>>({})
    const [loadingWorlds, setLoadingWorlds] = useState(false)

    // Bulk Server Update State
    const [showBulkServerModal, setShowBulkServerModal] = useState(false)
    const [bulkTargetServer, setBulkTargetServer] = useState(DEFAULT_SERVER)
    const [serverDropdownOpen, setServerDropdownOpen] = useState(false)
    const [bulkTargetWorld, setBulkTargetWorld] = useState('')
    const [bulkAvailableWorlds, setBulkAvailableWorlds] = useState<Record<string, string>>({})
    const [loadingBulkWorlds, setLoadingBulkWorlds] = useState(false)
    const [bulkAddServerDropdownOpen, setBulkAddServerDropdownOpen] = useState(false)
    const searchInputRef = React.useRef<HTMLInputElement>(null)

    // Add/Edit Account Dropdown State
    const [addAccountServerDropdownOpen, setAddAccountServerDropdownOpen] = useState(false)

    // Filters
    const [showFilters, setShowFilters] = useState(false)
    const [filterServer, setFilterServer] = useState('')
    const [filterStatus, setFilterStatus] = useState<string>('all') // all, active, stopped
    const [filterCaptcha, setFilterCaptcha] = useState<string>('all') // all, with_captcha, no_captcha
    const [filterIncoming, setFilterIncoming] = useState<string>('all') // all, safe, under_attack
    const [filterGroup, setFilterGroup] = useState<string>('all') // all, [group_name]
    const [filterProxy, setFilterProxy] = useState<string>('all') // all, no_proxy

    // Bulk Add State
    const [showBulkAddModal, setShowBulkAddModal] = useState(false)
    const [bulkAddData, setBulkAddData] = useState({
        accountsRaw: '',
        server: user?.preferences?.defaultServer || DEFAULT_SERVER,
        world: '',
        group: ''
    })
    const [isBulkAdding, setIsBulkAdding] = useState(false)
    // Advanced Bulk Add State
    const [parsedAccounts, setParsedAccounts] = useState<any[]>([])
    const [worldCache, setWorldCache] = useState<Record<string, Record<string, string>>>({})

    // Row Interactions & State
    const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null)
    const [rowDropdown, setRowDropdown] = useState<{ id: string, type: 'server' | 'world' } | null>(null)
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(() => {
        const saved = localStorage.getItem('multi_expert_accounts_per_page')
        return saved ? Number(saved) : 50
    })

    useEffect(() => {
        localStorage.setItem('multi_expert_accounts_per_page', itemsPerPage.toString())
    }, [itemsPerPage])
    const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' })

    const [loggingInId, setLoggingInId] = useState<string | null>(null)
    const isLoggingIn = (id: string) => loggingInId === id
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null)

    const [editingId, setEditingId] = useState<string | null>(null)
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        variant: 'info' | 'danger' | 'success';
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', variant: 'info', onConfirm: () => { } })

    const [automationStatus, setAutomationStatus] = useState<Record<string, string>>({})
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        const handleStatus = (_: any, { accountId, message }: any) => {
            setAutomationStatus(prev => ({ ...prev, [accountId]: message }))
        }

        (window as any).ipcRenderer.on('automation-status', handleStatus);

        return () => {
            (window as any).ipcRenderer.off('automation-status', handleStatus);
        }
    }, [])

    // Unique servers for filter
    const uniqueServers = React.useMemo(() => {
        const servers = accounts.map(acc => acc.server).filter(Boolean)
        return Array.from(new Set(servers))
    }, [accounts])

    const stats = React.useMemo(() => ({
        total: accounts.length,
        enabled: accounts.filter(a => a.enabled).length,
        paused: accounts.filter(a => !a.enabled).length,
        captcha: accounts.filter(a => a.hasCaptcha).length,
        attacks: accounts.filter(a => a.incoming > 0).length,
        noProxy: accounts.filter(a => !a.proxy || a.proxy === 'Sem Proxy').length,
    }), [accounts]);

    const findAvailableProxy = () => {
        if (!userProxies || userProxies.length === 0) return 'Sem Proxy'

        // simple: find one that is not used by any account
        const usedProxies = new Set(accounts.map(acc => acc.proxy))
        const unused = userProxies.find(p => !usedProxies.has(p.address))

        if (unused) return unused.address

        // If all are used, maybe return the first one? Or just 'Sem Proxy'?
        // "available" usually implies "I have one I can use". If all are full... 
        // Let's return the first one as a fallback if the user has proxies but all are used.
        // This ensures "automation" of selection.
        return userProxies[0].address
    }

    const [formData, setFormData] = useState({
        name: '',
        password: '',
        server: user?.preferences?.defaultServer || DEFAULT_SERVER,
        world: user?.preferences?.defaultWorld || '',
        proxy: 'Sem Proxy',
        group: '',
        // Strategy settings
        construction: user?.preferences?.defaultConstructionModel || '',
        recruitment: user?.preferences?.defaultRecruitmentModel || '',
        scavenge: user?.preferences?.defaultScavengeActive || false,
        premiumExchange: user?.preferences?.defaultPremiumExchangeActive || false,
        discordWebhook: ''
    })

    const [constructionModels, setConstructionModels] = useState<any[]>([])
    const [recruitmentModels, setRecruitmentModels] = useState<any[]>([])

    // Unique groups for filter - Including groups from preferences
    const uniqueGroups = React.useMemo(() => {
        const accountGroups = accounts.map(acc => acc.group).filter(Boolean)
        const preferenceGroups = Object.keys(groupColors)
        return Array.from(new Set([...accountGroups, ...preferenceGroups]))
    }, [accounts, groupColors])

    const fetchAccounts = async () => {
        try {
            const data = await (window as any).ipcRenderer.invoke('accounts:get', userUuid)
            setAccounts(data)
        } catch (error) {
            console.error('Error fetching accounts:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchProxies = async () => {
        try {
            const data = await (window as any).ipcRenderer.invoke('proxies:get', userUuid)
            setUserProxies(data)
        } catch (error) {
            console.error('Error fetching proxies:', error)
        }
    }

    useEffect(() => {
        if (userUuid) {
            fetchAccounts()
            fetchProxies()

            const fetchModels = async () => {
                try {
                    const [constrResult, recrResult] = await Promise.all([
                        (window as any).ipcRenderer.invoke('construction:get-models', userUuid),
                        (window as any).ipcRenderer.invoke('recruitment:get-models', userUuid)
                    ])
                    setConstructionModels(constrResult?.models || [])
                    setRecruitmentModels(recrResult?.models || [])
                } catch (err) {
                    console.error('Error fetching models:', err)
                }
            }
            fetchModels()

            const interval = setInterval(() => {
                fetchAccounts()
            }, 10000)

            return () => clearInterval(interval)
        }
    }, [userUuid])



    // Update form defaults when user preferences change
    useEffect(() => {
        if (user?.preferences) {
            setFormData(prev => ({
                ...prev,
                server: user.preferences.defaultServer || prev.server,
                world: user.preferences.defaultWorld || prev.world,
                // Apply default strategy preferences
                construction: user.preferences.defaultConstructionModel || '',
                recruitment: user.preferences.defaultRecruitmentModel || '',
                scavenge: user.preferences.defaultScavengeActive || false,
                premiumExchange: user.preferences.defaultPremiumExchangeActive || false
            }))
            setBulkAddData(prev => ({
                ...prev,
                server: user.preferences.defaultServer || prev.server,
                world: user.preferences.defaultWorld || prev.world
            }))
        }
    }, [user])

    // Auto-select first group if none is selected and groups exist
    useEffect(() => {
        if (uniqueGroups.length > 0 && !formData.group && !editingId && showAddModal) {
            setFormData(prev => ({ ...prev, group: uniqueGroups[0] }))
        }
    }, [uniqueGroups, editingId, showAddModal])

    useEffect(() => {
        const fetchWorlds = async () => {
            if (!formData.server) return
            setAvailableWorlds({}) // Clear previous worlds immediately
            setLoadingWorlds(true)
            try {
                const worlds = await (window as any).ipcRenderer.invoke('automation:get-servers', formData.server)
                setAvailableWorlds(worlds || {})
            } catch (err) {
                console.error(err)
                toast.error('Erro ao carregar mundos.')
            } finally {
                setLoadingWorlds(false)
            }
        }
        fetchWorlds()
    }, [formData.server])

    // Fetch worlds when Bulk Add Server changes
    useEffect(() => {
        const fetchBulkWorlds = async () => {
            if (!bulkAddData.server) return
            // Fetch if modal is open to ensure data availability on open
            if (!showBulkAddModal && Object.keys(bulkAvailableWorlds).length > 0) return

            setLoadingBulkWorlds(true)
            try {
                const worlds = await (window as any).ipcRenderer.invoke('automation:get-servers', bulkAddData.server)
                setBulkAvailableWorlds(worlds || {})
            } catch (err) {
                console.error(err)
            } finally {
                setLoadingBulkWorlds(false)
            }
        }
        if (showBulkAddModal) {
            fetchBulkWorlds()
        }
    }, [bulkAddData.server, showBulkAddModal])

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (rowDropdown && !target.closest('.row-dropdown-container')) {
                setRowDropdown(null);
            }
            if (bulkAddServerDropdownOpen && !target.closest('.bulk-server-dropdown-container')) {
                setBulkAddServerDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [rowDropdown, bulkAddServerDropdownOpen]);

    const handleAddAccount = async (e: React.FormEvent) => {
        e.preventDefault()

        const worldPrefix = formData.world
        const worldUrl = formData.server.replace('www', worldPrefix)

        // Find selected models
        const constrModel = constructionModels.find(m => m.uuid === formData.construction)
        const recrModel = recruitmentModels.find(m => m.uuid === formData.recruitment)

        const accountData = {
            ...formData,
            world: worldUrl,
            worldPrefix,
            config: {
                construction: {
                    active: !!formData.construction,
                    buildingOrder: constrModel?.buildingOrder || [],
                    templateUuid: formData.construction || ''
                },
                recruitment: {
                    active: !!formData.recruitment,
                    units: recrModel?.units || {},
                    templateUuid: formData.recruitment || ''
                },
                scavenge: {
                    active: formData.scavenge
                },
                premiumExchange: {
                    active: formData.premiumExchange
                }
            }
        }

        let result;
        if (editingId) {
            // Update existing account
            result = await (window as any).ipcRenderer.invoke('accounts:update', {
                id: editingId,
                ...accountData,
                updatedAt: new Date().toISOString()
            })
        } else {
            // Add new account
            result = await (window as any).ipcRenderer.invoke('accounts:add', {
                ...accountData,
                ownerUuid: userUuid
            })
        }

        if (result.success) {

            toast.success(editingId ? 'Conta atualizada com sucesso!' : 'Conta adicionada com sucesso!')
            setShowAddModal(false)
            setEditingId(null)
            fetchAccounts()
            setFormData({
                name: '',
                password: '',
                server: user?.preferences?.defaultServer || DEFAULT_SERVER,
                world: user?.preferences?.defaultWorld || '',
                proxy: findAvailableProxy(),
                group: '',
                construction: user?.preferences?.defaultConstructionModel || '',
                recruitment: user?.preferences?.defaultRecruitmentModel || '',
                scavenge: user?.preferences?.defaultScavengeActive || false,
                premiumExchange: user?.preferences?.defaultPremiumExchangeActive || false,
                discordWebhook: ''
            })
        } else {
            toast.error(`Erro ao ${editingId ? 'atualizar' : 'adicionar'} conta: ` + result.error)
        }
    }

    const handleDeleteRequest = (id?: string) => {
        const isBulk = !id
        const count = isBulk ? selectedAccounts.length : 1

        setConfirmState({
            isOpen: true,
            title: isBulk ? 'Excluir Contas' : 'Excluir Conta',
            message: isBulk
                ? `Você está prestes a remover ${count} contas selecionadas. Isso não pode ser desfeito.`
                : 'Você está prestes a remover esta conta permanentemente. Isso não pode ser desfeito.',
            variant: 'danger',
            onConfirm: () => {
                if (isBulk) {
                    handleBulkDelete()
                } else if (id) {
                    deleteSingleAccount(id)
                }
            }
        })
    }

    const handleToggleAccount = async (acc: any) => {
        const newStatus = !acc.enabled;
        const result = await (window as any).ipcRenderer.invoke('accounts:update', {
            id: acc._id,
            enabled: newStatus
        });

        if (result.success) {
            toast.success(newStatus ? 'Automação ativada para a conta.' : 'Automação pausada para a conta.');
            fetchAccounts();
        } else {
            toast.error('Erro ao alterar status: ' + result.error);
        }
    }

    const deleteSingleAccount = async (id: string) => {
        const result = await (window as any).ipcRenderer.invoke('accounts:delete', id)
        if (result.success) {
            toast.success('Conta removida.')
            fetchAccounts()
        } else {
            toast.error('Erro ao excluir conta: ' + result.error)
        }
    }

    const handleEditAccount = (acc: any) => {
        setEditingId(acc._id)
        setFormData({
            name: acc.name,
            password: acc.password,
            server: acc.server || DEFAULT_SERVER,
            world: acc.worldPrefix || '',
            proxy: acc.proxy || 'Sem Proxy',
            group: acc.group || '',
            construction: acc.config?.construction?.templateUuid || '',
            recruitment: acc.config?.recruitment?.templateUuid || '',
            scavenge: acc.config?.scavenge?.active || false,
            premiumExchange: acc.config?.premiumExchange?.active || false,
            discordWebhook: acc.discordWebhook || ''
        })
        setShowAddModal(true)
    }

    const handleBulkAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsBulkAdding(true)

        // If there are no parsed accounts but there is text, try to process text first
        let finalAccounts = [...parsedAccounts]
        if (bulkAddData.accountsRaw.trim()) {
            const processed = processRawAccounts(bulkAddData.accountsRaw)
            finalAccounts = [...finalAccounts, ...processed]
        }

        if (finalAccounts.length === 0) {
            toast.error('Adicione pelo menos uma conta.')
            setIsBulkAdding(false)
            return
        }

        try {
            const result = await (window as any).ipcRenderer.invoke('accounts:bulk-add', {
                accounts: finalAccounts.map(({ tempId, ...rest }) => rest), // Remove tempId
                ownerUuid: userUuid
            })
            if (result.success) {
                toast.success(`${result.count} contas adicionadas com sucesso!`)
                setShowBulkAddModal(false)
                setBulkAddData({ accountsRaw: '', server: user?.preferences?.defaultServer || DEFAULT_SERVER, world: '', group: '' })
                setParsedAccounts([])
                fetchAccounts()
            } else {
                toast.error('Erro ao adicionar contas: ' + result.error)
            }
        } catch (error: any) {
            toast.error('Erro inesperado: ' + error.message)
        } finally {
            setIsBulkAdding(false)
        }
    }

    const processRawAccounts = (raw: string) => {
        const lines = raw.split('\n').filter(l => l.trim().includes('|'))
        return lines.map(line => {
            const [name, password, specificWorld] = line.split('|').map(s => s.trim())
            return {
                tempId: Math.random().toString(36).substr(2, 9),
                name,
                password,
                server: bulkAddData.server,
                world: specificWorld || bulkAddData.world, // Use specific if provided, else default
                worldPrefix: specificWorld || bulkAddData.world, // Simplified assumption
                group: bulkAddData.group
            }
        })
    }

    const handleProcessBuffer = () => {
        if (!bulkAddData.accountsRaw.trim()) return
        const newAccounts = processRawAccounts(bulkAddData.accountsRaw)
        setParsedAccounts(prev => [...prev, ...newAccounts])
        setBulkAddData(prev => ({ ...prev, accountsRaw: '' }))
    }

    const updateParsedAccount = (tempId: string, field: string, value: string) => {
        setParsedAccounts(prev => prev.map(acc => {
            if (acc.tempId === tempId) {
                const updated = { ...acc, [field]: value }
                // If server changes, reset world?
                if (field === 'server') {
                    updated.world = ''
                    updated.worldPrefix = ''
                    // Trigger fetch for this server if not in cache
                    fetchWorldsForServer(value)
                }
                return updated
            }
            return acc
        }))
    }

    const removeParsedAccount = (tempId: string) => {
        setParsedAccounts(prev => prev.filter(a => a.tempId !== tempId))
    }

    const fetchWorldsForServer = async (domain: string) => {
        if (worldCache[domain]) return
        try {
            const worlds = await (window as any).ipcRenderer.invoke('automation:get-servers', domain)
            setWorldCache(prev => ({ ...prev, [domain]: worlds || {} }))
        } catch (e) {
            console.error('Failed to fetch worlds for ' + domain)
        }
    }


    const performLogin = async (id: string, autoClose: boolean = false) => {
        setLoggingInId(id)
        const toastId = toast.loading('Conectando ao mundo...')
        try {
            const result = await (window as any).ipcRenderer.invoke('accounts:login', { id, autoClose })
            if (result.success) {
                toast.success(autoClose ? 'Login realizado com sucesso! Sessão salva.' : 'Sessão ativa e dados atualizados!', { id: toastId })
                fetchAccounts()
            } else {
                toast.error('Falha na conexão: ' + result.error, { id: toastId })
            }
        } catch (error) {
            console.error('Login error:', error)
            toast.error('Erro de automação inesperado.', { id: toastId })
        } finally {
            setLoggingInId(null)
        }
    }

    const handleLoginAccount = async (id: string) => {
        const account = accounts.find(a => a._id === id)

        if (!account) return

        // Check for active session to determine if we should auto-close
        const hasSession = account.cookies && account.cookies.some((c: any) => c.name.includes('sid'))

        // Auto close if: No session (First time) AND User preference enabled
        const shouldAutoClose = !hasSession && (user?.preferences?.closeBrowserOnFirstLogin ?? false)

        const performSafeLogin = () => performLogin(id, shouldAutoClose)

        // Verificação de Proxy
        if (!account.proxy || account.proxy === 'Sem Proxy' || account.proxy.trim() === '') {
            setConfirmState({
                isOpen: true,
                title: 'Conexão Sem Proxy',
                message: 'Sua conta pode ser banida caso você conecte sem proxy, use essa função apenas para entender o funcionamento da ferramenta, mas em contas reais, não conecte sem proxy.',
                variant: 'danger',
                onConfirm: () => {
                    // Se passar do proxy, verificar captcha (encadeamento simples ou permitir passar direto para login?)
                    // Se aceitou sem proxy, verificamos o captcha em seguida? 
                    // Simplificação: Se aceitou o risco de IP, checa captcha.
                    if (account.hasCaptcha) {
                        setConfirmState({
                            isOpen: true,
                            title: 'Captcha Ativo',
                            message: 'Esta conta está marcada com captcha ativo. Deseja continuar e tentar resolver manualmente?',
                            variant: 'info',
                            onConfirm: performSafeLogin
                        })
                    } else {
                        performSafeLogin()
                    }
                }
            })
            return
        }

        performLogin(id, shouldAutoClose)
    }

    const [autoAssignConfirm, setAutoAssignConfirm] = useState(false)

    const handleAutoAssignProxies = async (allowReuse: boolean) => {
        const toastId = toast.loading('Atribuindo proxies...')
        try {
            const result = await (window as any).ipcRenderer.invoke('proxies:auto-assign', { userUuid, allowReuse })
            if (result.success) {
                if (result.count > 0) {
                    toast.success(`${result.count} proxies atribuídos com sucesso!`, { id: toastId })
                    fetchAccounts()
                } else {
                    // Check specific message or fallback
                    toast.success(result.message || 'Nenhum proxy atribuído.', { id: toastId })
                }
            } else {
                toast.error('Info: ' + (result.error || result.message), { id: toastId })
            }
        } catch (error: any) {
            toast.error('Erro inesperado: ' + error.message, { id: toastId })
        }
        setAutoAssignConfirm(false)
    }

    const handleBulkLogin = async () => {
        setIsBulkLoggingIn(true)
        setIsStopping(false)
        stopBulkRef.current = false
        const toastId = toast.loading(`Iniciando conexão em massa (${bulkConcurrency} por vez)...`)
        let successCount = 0
        let failCount = 0

        // Process in chunks based on concurrency
        for (let i = 0; i < selectedAccounts.length; i += bulkConcurrency) {
            if (stopBulkRef.current) {
                toast.error('Conexão em massa interrompida pelo usuário.', { id: toastId })
                break
            }

            const chunk = selectedAccounts.slice(i, i + bulkConcurrency)
            const remaining = selectedAccounts.length - i
            toast.loading(`Conectando ${Math.min(bulkConcurrency, remaining)} contas (${i + 1} a ${Math.min(i + bulkConcurrency, selectedAccounts.length)} de ${selectedAccounts.length})...`, { id: toastId })

            try {
                const results = await Promise.all(chunk.map(id => (window as any).ipcRenderer.invoke('accounts:login', id)))

                results.forEach((result: any) => {
                    if (result.success) {
                        successCount++
                    } else {
                        failCount++
                    }
                })

                fetchAccounts()
            } catch (err) {
                failCount += chunk.length
            }
        }

        if (!stopBulkRef.current) {
            toast.success(`Finalizado! ${successCount} sucessos, ${failCount} falhas.`, { id: toastId })
        }
        setIsBulkLoggingIn(false)
        setIsStopping(false)
        setSelectedAccounts([])
    }

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedAccounts(paginatedAccounts.map(acc => acc._id))
        } else {
            setSelectedAccounts([])
        }
    }

    const handleSelectOne = (id: string, index: number, isShift?: boolean) => {
        setSelectedAccounts(prev => {
            if (isShift && lastSelectedIndex !== null) {
                const start = Math.min(lastSelectedIndex, index)
                const end = Math.max(lastSelectedIndex, index)
                const rangeIds = paginatedAccounts
                    .slice(start, end + 1)
                    .map(acc => acc._id)

                const isAdding = !prev.includes(id)
                if (isAdding) {
                    return Array.from(new Set([...prev, ...rangeIds]))
                } else {
                    return prev.filter(selectedId => !rangeIds.includes(selectedId))
                }
            }

            setLastSelectedIndex(index)
            if (prev.includes(id)) {
                return prev.filter(i => i !== id)
            }
            return [...prev, id]
        })
    }

    const handleBulkDelete = async () => {
        const toastId = toast.loading('Excluindo contas...')
        let successCount = 0

        for (const id of selectedAccounts) {
            const result = await (window as any).ipcRenderer.invoke('accounts:delete', id)
            if (result.success) successCount++
        }

        toast.success(`${successCount} contas removidas.`, { id: toastId })
        setSelectedAccounts([])
        fetchAccounts()
    }

    // Bulk Toggle (Enable/Disable)
    const handleBulkToggle = async (enable: boolean) => {
        const toastId = toast.loading(enable ? 'Ativando contas...' : 'Pausando contas...')
        let successCount = 0

        const updates = selectedAccounts.map(id =>
            (window as any).ipcRenderer.invoke('accounts:update', { id, enabled: enable })
        )

        const results = await Promise.all(updates)
        successCount = results.filter((r: any) => r.success).length

        toast.success(`${successCount} contas ${enable ? 'ativadas' : 'pausadas'}.`, { id: toastId })
        fetchAccounts()
        setSelectedAccounts([])
    }

    useEffect(() => {
        if (!showBulkServerModal) return
        const fetchBulkWorlds = async () => {
            setLoadingBulkWorlds(true)
            try {
                const worlds = await (window as any).ipcRenderer.invoke('automation:get-servers', bulkTargetServer)
                setBulkAvailableWorlds(worlds || {})
                // Only reset world if it's not in the new list? Or always reset?
                // Safer to reset unless we want to try to keep it.
                setBulkTargetWorld('')
            } catch (err) {
                console.error(err)
                toast.error('Erro ao carregar mundos.')
            } finally {
                setLoadingBulkWorlds(false)
            }
        }
        fetchBulkWorlds()
    }, [bulkTargetServer, showBulkServerModal])

    const handleBulkServerUpdate = async () => {
        if (!bulkTargetWorld) {
            toast.error('Selecione um mundo.')
            return
        }

        const toastId = toast.loading('Migrando contas...')
        let successCount = 0

        const worldUrl = bulkTargetServer.replace('www', bulkTargetWorld)

        const updates = selectedAccounts.map(id =>
            (window as any).ipcRenderer.invoke('accounts:update', {
                id,
                server: bulkTargetServer,
                world: worldUrl,
                worldPrefix: bulkTargetWorld
            })
        )

        const results = await Promise.all(updates)
        successCount = results.filter((r: any) => r.success).length

        toast.success(`${successCount} contas migradas para ${bulkTargetWorld.toUpperCase()}.`, { id: toastId })
        setShowBulkServerModal(false)
        fetchAccounts()
        setSelectedAccounts([])
    }

    // Effect to fetch worlds when bulk server changes
    useEffect(() => {
        if (!showBulkAddModal) return
        const fetchBulkAddWorlds = async () => {
            setLoadingBulkWorlds(true)
            try {
                const worlds = await (window as any).ipcRenderer.invoke('automation:get-servers', bulkAddData.server)
                setBulkAvailableWorlds(worlds || {})
                // If current world prefix is not in new worlds, or if no world is selected yet, pick the first one from the list
                const worldKeys = Object.keys(worlds || {})
                if (worldKeys.length > 0 && (!bulkAddData.world || !worlds[bulkAddData.world])) {
                    setBulkAddData(prev => ({ ...prev, world: worldKeys[0] }))
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoadingBulkWorlds(false)
            }
        }
        fetchBulkAddWorlds()
    }, [bulkAddData.server, showBulkAddModal])

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const timeAgo = (dateString: string) => {
        if (!dateString) return 'Nunca'
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 5) return 'Agora mesmo'
        if (diffInSeconds < 60) return `${diffInSeconds}s`

        if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60)
            const seconds = diffInSeconds % 60
            return `${minutes}m ${seconds}s`
        }

        if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600)
            const minutes = Math.floor((diffInSeconds % 3600) / 60)
            return `${hours}h ${minutes}m`
        }

        const days = Math.floor(diffInSeconds / 86400)
        return `${days} ${days === 1 ? 'dia' : 'dias'}`
    }

    const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj)
    }

    const sortedAccounts = [...accounts].sort((a, b) => {
        if (!sortConfig.key) return 0

        let aValue = getNestedValue(a, sortConfig.key)
        let bValue = getNestedValue(b, sortConfig.key)

        // Handle numeric sorting for strings "100/200" (Farm)
        if (typeof aValue === 'string' && aValue.includes('/')) {
            aValue = parseInt(aValue.split('/')[0])
            bValue = parseInt(bValue.split('/')[0])
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
    })

    const filteredAccounts = sortedAccounts.filter(acc => {
        const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            acc.worldPrefix?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesServer = filterServer ? acc.server === filterServer : true

        const matchesStatus = filterStatus === 'all' ? true :
            filterStatus === 'active' ? acc.enabled :
                filterStatus === 'stopped' ? !acc.enabled : true

        const matchesCaptcha = filterCaptcha === 'all' ? true :
            filterCaptcha === 'with_captcha' ? acc.hasCaptcha :
                filterCaptcha === 'no_captcha' ? !acc.hasCaptcha : true

        const matchesIncoming = filterIncoming === 'all' ? true :
            filterIncoming === 'safe' ? acc.incoming === 0 :
                filterIncoming === 'under_attack' ? acc.incoming > 0 : true

        const matchesGroup = filterGroup === 'all' ? true : acc.group === filterGroup

        const matchesProxyFilter = filterProxy === 'all' ? true :
            filterProxy === 'no_proxy' ? (!acc.proxy || acc.proxy === 'Sem Proxy') : true

        return matchesSearch && matchesServer && matchesStatus && matchesCaptcha && matchesIncoming && matchesGroup && matchesProxyFilter
    })

    // Pagination Calculation
    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage)
    const paginatedAccounts = filteredAccounts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl + F: Focus Search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault()
                searchInputRef.current?.focus()
            }
            // Ctrl + A: Select All (in current view)
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                const activeElement = document.activeElement
                const isTextInput = (activeElement?.tagName === 'INPUT' && (activeElement as HTMLInputElement).type !== 'checkbox') ||
                    activeElement?.tagName === 'TEXTAREA'

                if (!isTextInput) {
                    e.preventDefault()
                    // Toggle: If all are selected, deselect all. Otherwise, select all.
                    const allSelected = paginatedAccounts.length > 0 && selectedAccounts.length === paginatedAccounts.length
                    if (allSelected) {
                        setSelectedAccounts([])
                    } else {
                        setSelectedAccounts(paginatedAccounts.map(acc => acc._id))
                    }
                }
            }
            // Delete: Remove selected accounts
            if (e.key === 'Delete') {
                const activeElement = document.activeElement
                const isTextInput = (activeElement?.tagName === 'INPUT' && (activeElement as HTMLInputElement).type !== 'checkbox') ||
                    activeElement?.tagName === 'TEXTAREA'

                if (!isTextInput && selectedAccounts.length > 0) {
                    e.preventDefault()
                    handleDeleteRequest()
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [paginatedAccounts, selectedAccounts])

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20">
                        <LayoutGrid className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter text-textMain uppercase leading-none">Cadastrar Contas</h1>
                        <p className="text-textMuted font-medium tracking-widest text-xs mt-1">Cadastre, edite e gerencie suas contas</p>
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                    { label: 'Cadastradas', value: stats.total, icon: LayoutGrid, color: 'text-zinc-400', bg: 'bg-zinc-400/5', border: 'border-zinc-400/10', glow: 'shadow-zinc-400/5', iconBg: 'bg-zinc-400/10', type: 'all' },
                    { label: 'Ativas', value: stats.enabled, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10', glow: 'shadow-emerald-500/5', iconBg: 'bg-emerald-500/10', type: 'active' },
                    { label: 'Pausadas', value: stats.paused, icon: Pause, color: 'text-amber-500', bg: 'bg-amber-500/5', border: 'border-amber-500/10', glow: 'shadow-amber-500/5', iconBg: 'bg-amber-500/10', type: 'paused' },
                    { label: 'Captcha', value: stats.captcha, icon: ScanFace, color: 'text-purple-500', bg: 'bg-purple-500/5', border: 'border-purple-500/10', glow: 'shadow-purple-500/5', iconBg: 'bg-purple-500/10', type: 'captcha' },
                    { label: 'Ataques', value: stats.attacks, icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/5', border: 'border-red-500/10', glow: 'shadow-red-500/5', iconBg: 'bg-red-500/10', type: 'attacks' },
                    { label: 'Sem Proxy', value: stats.noProxy, icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/10', glow: 'shadow-blue-500/5', iconBg: 'bg-blue-500/10', type: 'no_proxy' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            duration: 0.5,
                            delay: i * 0.1,
                            ease: [0.23, 1, 0.32, 1]
                        }}
                        onClick={() => {
                            // Reset tags and set specific filter
                            setFilterServer('')
                            setFilterStatus('all')
                            setFilterCaptcha('all')
                            setFilterIncoming('all')
                            setFilterProxy('all')
                            setFilterGroup('all')

                            if (stat.type === 'active') setFilterStatus('active')
                            else if (stat.type === 'paused') setFilterStatus('stopped')
                            else if (stat.type === 'captcha') setFilterCaptcha('with_captcha')
                            else if (stat.type === 'attacks') setFilterIncoming('under_attack')
                            else if (stat.type === 'no_proxy') setFilterProxy('no_proxy')

                            if (!showFilters && stat.type !== 'all') setShowFilters(true)
                        }}
                        className={`relative overflow-hidden p-3 rounded-xl border ${stat.border} ${stat.bg} backdrop-blur-md hover:translate-y-[-2px] hover:shadow-lg ${stat.glow} transition-all duration-300 group cursor-pointer flex items-center gap-3`}
                    >
                        <div className={`p-2 rounded-lg ${stat.iconBg} border ${stat.border}`}>
                            <stat.icon className={`w-4 h-4 ${stat.color} filter drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                        </div>

                        <div className="flex flex-col">
                            <span className={`text-xl font-black italic tracking-tight leading-none ${stat.color} drop-shadow-sm`}>
                                {stat.value}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-zinc-400 transition-colors leading-none mt-1">
                                {stat.label}
                            </span>
                        </div>

                        {/* Bottom decorative line - subtle */}
                        <div className={`absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-500 ${stat.iconBg.replace('10', '30')}`} />
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {/* Actions Bar */}
                <div className="flex flex-wrap items-center gap-3">

                    <button
                        onClick={() => {
                            setEditingId(null)
                            setFormData({
                                name: '',
                                password: '',
                                server: user?.preferences?.defaultServer || DEFAULT_SERVER,
                                world: user?.preferences?.defaultWorld || '',
                                proxy: findAvailableProxy(),
                                group: '',
                                construction: user?.preferences?.defaultConstructionModel || '',
                                recruitment: user?.preferences?.defaultRecruitmentModel || '',
                                scavenge: user?.preferences?.defaultScavengeActive || false,
                                premiumExchange: user?.preferences?.defaultPremiumExchangeActive || false,
                                discordWebhook: ''
                            })
                            setShowAddModal(true)
                        }}
                        className="btn-save px-6 py-3 text-sm"
                    >
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Adicionar Nova Conta
                    </button>

                    <button
                        onClick={() => setShowBulkAddModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all tracking-tight group active:scale-95 cursor-pointer text-sm"
                    >
                        <LayoutGrid className="w-4 h-4 group-hover:scale-110 transition-transform" /> Adição em Massa
                    </button>

                    <button
                        onClick={() => setAutoAssignConfirm(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all tracking-tight group active:scale-95 cursor-pointer text-sm"
                    >
                        <Globe className="w-4 h-4 group-hover:scale-110 transition-transform" /> Auto Atribuir Proxies
                    </button>

                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Buscar por nome ou mundo... (Ctrl+F)"
                            className="w-full bg-sidebar border border-white/5 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-emerald-500/50 text-white placeholder-zinc-600 transition-all font-medium text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-[#111111]/80 border border-white/10 px-4 py-3 rounded-xl">
                        <span className="text-xs font-bold text-textMuted uppercase">Exibir:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="bg-transparent text-white font-bold outline-none cursor-pointer text-sm"
                        >
                            <option value={10} className="bg-[#111111]">10</option>
                            <option value={20} className="bg-[#111111]">20</option>
                            <option value={50} className="bg-[#111111]">50</option>
                            <option value={100} className="bg-[#111111]">100</option>
                            <option value={200} className="bg-[#111111]">200</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all cursor-pointer ${showFilters ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-[#111111]/80 border-white/10 text-white hover:bg-white/5'}`}
                    >
                        <Filter className="w-4 h-4" />
                    </button>

                    {showFilters && (
                        <button
                            onClick={() => {
                                setFilterServer('')
                                setFilterStatus('all')
                                setFilterCaptcha('all')
                                setFilterIncoming('all')
                                setFilterProxy('all')
                                setFilterGroup('all')
                            }}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all text-xs font-bold uppercase cursor-pointer"
                        >
                            Limpar Filtros <X className="w-3 h-3" />
                        </button>
                    )}
                </div>

                {/* Filters Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-[#111111] border border-white/10 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-textMuted uppercase mb-2 block">Servidor</label>
                                    <select
                                        value={filterServer}
                                        onChange={(e) => setFilterServer(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-emerald-500/50 cursor-pointer"
                                    >
                                        <option value="" className="bg-[#111111]">Todos</option>
                                        {uniqueServers.map(serverDomain => {
                                            const srvData = Object.values(SERVER_DATA).find(s => s.domain === serverDomain)
                                            return (
                                                <option key={serverDomain} value={serverDomain} className="bg-[#111111]">
                                                    {srvData ? srvData.name : serverDomain}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-textMuted uppercase mb-2 block">Status</label>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-emerald-500/50 cursor-pointer"
                                    >
                                        <option value="all" className="bg-[#111111]">Todos</option>
                                        <option value="active" className="bg-[#111111]">Ativos</option>
                                        <option value="stopped" className="bg-[#111111]">Parados</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-textMuted uppercase mb-2 block">Captcha</label>
                                    <select
                                        value={filterCaptcha}
                                        onChange={(e) => setFilterCaptcha(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-emerald-500/50 cursor-pointer"
                                    >
                                        <option value="all" className="bg-[#111111]">Todos</option>
                                        <option value="with_captcha" className="bg-[#111111]">Com Captcha</option>
                                        <option value="no_captcha" className="bg-[#111111]">Sem Captcha</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-textMuted uppercase mb-2 block">Ataques</label>
                                    <select
                                        value={filterIncoming}
                                        onChange={(e) => setFilterIncoming(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-emerald-500/50 cursor-pointer"
                                    >
                                        <option value="all" className="bg-[#111111]">Todos</option>
                                        <option value="safe" className="bg-[#111111]">Seguros</option>
                                        <option value="under_attack" className="bg-[#111111]">Sob Ataque</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-textMuted uppercase mb-2 block">Grupo</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 outline-none focus:border-emerald-500/50 text-white text-sm cursor-pointer"
                                        value={filterGroup}
                                        onChange={(e) => setFilterGroup(e.target.value)}
                                    >
                                        <option value="all" className="bg-[#111111]">Todos</option>
                                        {uniqueGroups.map(group => (
                                            <option key={group} value={group} className="bg-[#111111]">{group}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-textMuted uppercase mb-2 block">Proxy</label>
                                    <select
                                        value={filterProxy}
                                        onChange={(e) => setFilterProxy(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-emerald-500/50 cursor-pointer"
                                    >
                                        <option value="all" className="bg-[#111111]">Todos</option>
                                        <option value="no_proxy" className="bg-[#111111]">Sem Proxy</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bulk Actions Panel */}
                <AnimatePresence>
                    {selectedAccounts.length > 0 && (
                        <motion.div
                            key="bulk-actions"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="sticky top-2 z-50 bg-[#18181b]/95 backdrop-blur-xl shadow-2xl border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between mb-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-600 text-white font-bold px-3 py-1 rounded-lg text-xs">
                                    {selectedAccounts.length} Contas SELECIONADAS
                                </div>
                                <span className="text-xs font-medium text-textMuted">Ações em massa:</span>
                            </div>
                            <div className="flex gap-2">
                                <Tooltip content="Ativar Automação">
                                    <button
                                        onClick={() => handleBulkToggle(true)}
                                        className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                                    >
                                        <Play className="w-3.5 h-3.5 fill-current" /> Ativar
                                    </button>
                                </Tooltip>

                                <Tooltip content="Pausar Automação">
                                    <button
                                        onClick={() => handleBulkToggle(false)}
                                        className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                                    >
                                        <Pause className="w-3.5 h-3.5 fill-current" /> Pausar
                                    </button>
                                </Tooltip>

                                <Tooltip content="Alterar Servidor">
                                    <button
                                        onClick={() => setShowBulkServerModal(true)}
                                        className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                                    >
                                        <Globe className="w-3.5 h-3.5" /> Servidor
                                    </button>
                                </Tooltip>

                                {isBulkLoggingIn ? (
                                    <button
                                        onClick={() => {
                                            stopBulkRef.current = true
                                            setIsStopping(true)
                                        }}
                                        disabled={isStopping}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${isStopping ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white animate-pulse'}`}
                                    >
                                        {isStopping ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Parando...
                                            </>
                                        ) : (
                                            <>
                                                <X className="w-3.5 h-3.5" /> Interromper
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1.5 rounded-lg">
                                            <span className="text-[10px] font-bold text-indigo-400 uppercase">Abrir de:</span>
                                            <input
                                                type="number"
                                                min="1"
                                                max="20"
                                                value={bulkConcurrency}
                                                onChange={(e) => setBulkConcurrency(Math.max(1, Math.min(20, Number(e.target.value))))}
                                                className="w-10 bg-transparent text-white text-xs font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
                                            />
                                        </div>
                                        <Tooltip content={`Conectar Contas (${bulkConcurrency} por vez)`}>
                                            <button
                                                onClick={() => handleBulkLogin()}
                                                className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-500 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                                            >
                                                <LogIn className="w-3.5 h-3.5" /> Conectar tudo
                                            </button>
                                        </Tooltip>
                                    </div>
                                )}

                                <div className="w-px h-6 bg-white/10 mx-1"></div>

                                <button
                                    onClick={() => handleDeleteRequest()}
                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Excluir
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm relative">
                    {/* Glass Table Header */}
                    <div className="grid grid-cols-[50px_1.5fr_0.7fr_0.9fr_0.9fr_0.9fr_0.7fr_1.4fr_0.9fr_100px] gap-4 px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-300 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex justify-center">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-white/20 bg-black/40 checked:bg-primary accent-primary cursor-pointer transition-all"
                                checked={selectedAccounts.length === paginatedAccounts.length && paginatedAccounts.length > 0}
                                onChange={handleSelectAll}
                            />
                        </div>
                        <div className="cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>Conta / Servidor</div>
                        <div className="cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('group')}>Grupo</div>
                        <div className="text-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('status')}>Status</div>
                        <div className="text-center">Funcionalidades</div>
                        <div className="text-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('lastExecution')}>Última Execução</div>
                        <div className="text-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('points')}>Pontos</div>
                        <div className="text-center">Recursos / Armazém / Fazenda</div>
                        <div className="text-center">Unidades</div>
                        <div className="text-center">Ações</div>
                    </div>

                    {/* Table Body (List Items) */}
                    <div className="">
                        {isLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center opacity-70">
                                <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
                                <p className="font-bold text-sm tracking-wider uppercase text-emerald-500 animate-pulse">Carregando Contas...</p>
                            </div>
                        ) : paginatedAccounts.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center opacity-30">
                                <User className="w-16 h-16 stroke-[0.5] mb-4" />
                                <p className="font-bold text-lg tracking-tighter uppercase">Nenhuma conta encontrada</p>
                            </div>
                        ) : (
                            paginatedAccounts.map((acc, idx) => (
                                <motion.div
                                    key={acc._id || idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.02 }}
                                    className={`group grid grid-cols-[50px_1.5fr_0.7fr_0.9fr_0.9fr_0.9fr_0.7fr_1.4fr_0.9fr_100px] gap-4 p-3 border-b border-white/5 items-center hover:bg-white/[0.04] transition-colors relative ${selectedAccounts.includes(acc._id) ? 'bg-primary/5' : ''
                                        }`}
                                    onDoubleClick={(e) => {
                                        e.stopPropagation();
                                        handleLoginAccount(acc._id);
                                    }}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setMenuPosition({ x: e.clientX, y: e.clientY });
                                        setOpenMenuId(acc._id);
                                    }}
                                >
                                    {/* Selection */}
                                    <div className="flex justify-center relative z-10" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-white/20 bg-black/40 checked:bg-primary accent-primary cursor-pointer transition-all"
                                            checked={selectedAccounts.includes(acc._id)}
                                            onChange={(e) => handleSelectOne(acc._id, idx, (e.nativeEvent as MouseEvent).shiftKey)}
                                        />
                                    </div>

                                    {/* Active Strip */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${acc.status === 'Ativo' ? 'bg-primary' : 'bg-transparent'}`}></div>

                                    {/* Name & Server */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0 relative overflow-hidden">
                                            {getServerInfo(acc).flagUrl ? (
                                                <img src={getServerInfo(acc).flagUrl} className="w-full h-full object-cover opacity-80" alt="Flag" />
                                            ) : (
                                                <Globe className="w-5 h-5 text-textMuted" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex flex-col justify-center">
                                            <div className="flex items-center gap-2 mb-0.5" onClick={(e) => e.stopPropagation()}>
                                                <h3 className="font-bold text-white truncate text-sm">{acc.name}</h3>
                                                <span className="text-[9px] font-black text-accent bg-accent/10 px-1 rounded uppercase tracking-wider h-max">
                                                    {acc.worldPrefix?.toUpperCase() || 'BR'}
                                                </span>
                                            </div>

                                            {/* Persistent Indicators: Attacks & Captcha */}
                                            <div className="flex items-center gap-2">

                                                {/* Proxy Status */}
                                                <Tooltip content={acc.proxy.split(':')[0] || 'Sem Proxy'}>
                                                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold border transition-colors ${acc.proxy && acc.proxy !== 'Sem Proxy'
                                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                        : 'bg-white/5 text-zinc-500 border-white/5'
                                                        }`}>
                                                        <Globe className="w-3.5 h-3.5" />
                                                        <span className="truncate max-w-[60px]">{acc.proxy.split(':')[0] || 'Sem Proxy'}</span>
                                                    </div>
                                                </Tooltip>

                                                {/* Captcha Status */}
                                                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold border transition-colors ${acc.hasCaptcha
                                                    ? 'bg-red-500/20 text-red-500 border-red-500/20 animate-pulse'
                                                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                    }`} title={acc.hasCaptcha ? "Captcha Detectado!" : "Captcha Seguro"}>
                                                    <ScanFace className="w-3.5 h-3.5" />
                                                </div>

                                                {/* Attack Status */}
                                                <Tooltip content={acc.incoming > 0 ? `${acc.incoming} Ataques!` : "Sem ataques"}>
                                                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold border transition-colors ${acc.incoming > 0
                                                        ? 'bg-red-500/20 text-red-500 border-red-500/20 animate-pulse'
                                                        : 'bg-white/5 text-zinc-500 border-white/5'
                                                        }`}>
                                                        <ShieldAlert className="w-3.5 h-3.5" />
                                                        <span>{acc.incoming > 0 ? acc.incoming : '0'}</span>
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        {acc.group ? (
                                            <div className="group/tag relative">
                                                <div
                                                    className="flex items-center gap-1.5 px-2 py-1 rounded-md transition-all border"
                                                    style={{
                                                        backgroundColor: groupColors[acc.group] ? `${groupColors[acc.group]}15` : 'rgba(255, 255, 255, 0.05)',
                                                        borderColor: groupColors[acc.group] ? `${groupColors[acc.group]}30` : 'rgba(255, 255, 255, 0.1)',
                                                        color: groupColors[acc.group] || '#a1a1aa'
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Tags
                                                        className="w-3 h-3 cursor-pointer hover:scale-125 transition-transform"
                                                        style={{ color: groupColors[acc.group] || '#a1a1aa' }}
                                                        onClick={() => {
                                                            const color = prompt('Escolha uma cor (Hex: #ff0000):', groupColors[acc.group] || '#ff0000')
                                                            if (color) handleUpdateGroupColor(acc.group, color)
                                                        }}
                                                    />
                                                    <span className="text-[10px] font-bold truncate max-w-[100px]" title={acc.group}>
                                                        {acc.group}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-zinc-600 text-xs">-</span>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="flex justify-center flex-col items-center gap-1">
                                        <Tooltip content={acc.status === 'Ativo' ? "Sessão Conectada" : "Necessário logar na conta manualmente agora."}>
                                            <div className={`px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 whitespace-nowrap min-w-fit shadow-lg shadow-black/20 ${acc.status === 'Ativo'
                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                                : 'bg-white/5 border-white/10 text-textMuted'
                                                }`}>
                                                <div className={`w-1 h-1 rounded-full ${acc.status === 'Ativo' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`}></div>
                                                {acc.status === 'Ativo' ? 'Conectado' : 'Logue na conta pela 1. vez!'}
                                            </div>
                                        </Tooltip>

                                        {/* Automation Enabled Status */}
                                        <div className={`text-[9px] font-bold flex flex-col gap-0.5 uppercase tracking-wider ${acc.enabled ? 'text-primary' : 'text-amber-500'}`}>
                                            {isLoggingIn(acc._id) && automationStatus[acc._id] ? (
                                                <span className="text-blue-400 animate-pulse">{automationStatus[acc._id]}</span>
                                            ) : (
                                                acc.enabled ? (
                                                    <span className="flex items-center gap-1">
                                                        <Activity className="w-2.5 h-2.5" /> Em Execução
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1">
                                                        <Pause className="w-2.5 h-2.5" /> Pausado
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Atividades Column */}
                                    <div className="flex items-center justify-center">
                                        <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-full border border-white/5">
                                            <Tooltip content={`Construção: ${acc.config?.construction?.active ? 'Ativa' : 'Inativa'}`}>
                                                <Hammer className={`w-3 h-3 transition-colors ${acc.config?.construction?.active ? 'text-emerald-500' : 'text-zinc-700'}`} />
                                            </Tooltip>
                                            <Tooltip content={`Recrutamento: ${acc.config?.recruitment?.active ? 'Ativo' : 'Inativo'}`}>
                                                <Users className={`w-3 h-3 transition-colors ${acc.config?.recruitment?.active ? 'text-emerald-500' : 'text-zinc-700'}`} />
                                            </Tooltip>
                                            <Tooltip content={`Coleta: ${acc.config?.scavenge?.active ? 'Ativa' : 'Inativa'}`}>
                                                <Package className={`w-3 h-3 transition-colors ${acc.config?.scavenge?.active ? 'text-emerald-500' : 'text-zinc-700'}`} />
                                            </Tooltip>
                                            <Tooltip content={`Troca Premium: ${acc.config?.premiumExchange?.active ? 'Ativa' : 'Inativa'}`}>
                                                <RefreshCw className={`w-3 h-3 transition-colors ${acc.config?.premiumExchange?.active ? 'text-emerald-500' : 'text-zinc-700'}`} />
                                            </Tooltip>
                                        </div>
                                    </div>

                                    {/* Last Execution */}
                                    <div className="flex justify-center flex-col items-center gap-1">
                                        <Tooltip content={acc.lastExecution ? new Date(acc.lastExecution).toLocaleString('pt-BR') : "Nunca executado"}>
                                            <div className="flex items-center gap-1.5 opacity-80">
                                                <Clock className="w-3.5 h-3.5 text-textMuted" />
                                                <span className="text-xs font-medium text-textMuted whitespace-nowrap">
                                                    {timeAgo(acc.lastExecution)}
                                                </span>
                                            </div>
                                        </Tooltip>
                                    </div>

                                    {/* Points */}
                                    <div className="flex items-center justify-center gap-3">
                                        <Tooltip content="Pontos">
                                            <div className="flex items-center gap-1.5">
                                                <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                                                <span className="text-xs font-bold text-textMain">{acc.points?.toLocaleString() || 0}</span>
                                            </div>
                                        </Tooltip>
                                        <Tooltip content="Pontos Premium">
                                            <div className="flex items-center gap-1.5">
                                                <Crown className="w-3.5 h-3.5 text-purple-500" />
                                                <span className="text-xs font-medium text-purple-400">{acc.premiumPoints?.toLocaleString() || 0}</span>
                                            </div>
                                        </Tooltip>
                                    </div>

                                    {/* Resources & Storage & Farm */}
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="flex items-center gap-1.5 pr-2 border-r border-white/5">
                                            <Tooltip content="Madeira">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    {ASSETS.res.wood && <img src={ASSETS.res.wood} className="w-3 h-3" />}
                                                    <span className="text-[9px] font-mono text-zinc-300">{formatNumber(acc.resources?.wood)}</span>
                                                </div>
                                            </Tooltip>
                                            <Tooltip content="Argila">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    {ASSETS.res.stone && <img src={ASSETS.res.stone} className="w-3 h-3" />}
                                                    <span className="text-[9px] font-mono text-zinc-300">{formatNumber(acc.resources?.stone)}</span>
                                                </div>
                                            </Tooltip>
                                            <Tooltip content="Ferro">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    {ASSETS.res.iron && <img src={ASSETS.res.iron} className="w-3 h-3" />}
                                                    <span className="text-[9px] font-mono text-zinc-300">{formatNumber(acc.resources?.iron)}</span>
                                                </div>
                                            </Tooltip>
                                        </div>

                                        <div className="flex items-center gap-2 pl-1">
                                            <Tooltip content="Capacidade do Armazém">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    {ASSETS.res.storage && <img src={ASSETS.res.storage} className="w-3 h-3 opacity-90" />}
                                                    <span className="text-[9px] font-bold text-emerald-500/90">{formatNumber(acc.resources?.storage)}</span>
                                                </div>
                                            </Tooltip>
                                            <Tooltip content="Fazenda (Usada / Total)">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    {ASSETS.farm && <img src={ASSETS.farm} className="w-3 h-3 opacity-90" />}
                                                    <span className="text-[9px] font-bold text-zinc-400">
                                                        {acc.farm || '0/0'}
                                                    </span>
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </div>

                                    {/* Units */}
                                    <div className="flex items-center justify-center gap-2">
                                        {[
                                            { icon: ASSETS.units.spear, count: acc.units?.spear },
                                            { icon: ASSETS.units.sword, count: acc.units?.sword },
                                            { icon: ASSETS.units.light, count: acc.units?.light },
                                            { icon: ASSETS.units.spy, count: acc.units?.spy }
                                        ].map((u, i) => (
                                            <div key={i} className="flex flex-col items-center w-7">
                                                {u.icon && <img src={u.icon} className="w-3.5 h-3.5 mb-0.5" />}
                                                <span className="text-[9px] font-bold">{formatNumber(u.count)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-center gap-2 relative">
                                        <Tooltip content={acc.enabled ? "Pausar" : "Iniciar"}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleAccount(acc);
                                                }}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${acc.enabled
                                                    ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 ring-1 ring-amber-500/20'
                                                    : 'bg-primary/10 text-primary hover:bg-primary/20 ring-1 ring-primary/20'
                                                    }`}
                                            >
                                                {acc.enabled ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                                            </button>
                                        </Tooltip>

                                        <div className="relative">
                                            <Tooltip content="Opções da Conta">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        // Position menu below the button, aligned to its right edge (approximate left)
                                                        setMenuPosition({ x: rect.right - 192, y: rect.bottom });
                                                        setOpenMenuId(openMenuId === acc._id ? null : acc._id);
                                                    }}
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${openMenuId === acc._id
                                                        ? 'bg-white/20 text-white ring-1 ring-white/20'
                                                        : 'bg-white/5 hover:bg-white/10 text-textMuted hover:text-white ring-1 ring-white/10'
                                                        }`}
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </Tooltip>

                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer / Pagination Controls */}
                <div className="flex items-center justify-between px-2">
                    <div className="text-xs font-bold text-textMuted">
                        Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredAccounts.length)} de {filteredAccounts.length} contas
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="px-3 py-1.5 bg-white/5 rounded-lg disabled:opacity-50 hover:bg-white/10 font-bold text-xs cursor-pointer disabled:cursor-not-allowed"
                        >
                            Anterior
                        </button>
                        <button
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="px-3 py-1.5 bg-white/5 rounded-lg disabled:opacity-50 hover:bg-white/10 font-bold text-xs cursor-pointer disabled:cursor-not-allowed"
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal: Bulk Server Update */}
            <Modal
                isOpen={showBulkServerModal}
                onClose={() => setShowBulkServerModal(false)}
                title="Alterar Servidor em Massa"
                maxWidth="max-w-2xl"
            >
                <div className="p-6 space-y-4 min-h-[400px]">
                    <p className="text-zinc-400 text-sm">
                        Selecione o novo servidor para as <span className="text-emerald-500 font-bold">{selectedAccounts.length}</span> contas selecionadas.
                        <br /><span className="text-xs opacity-70">Nota: O mundo selecionado pode não corresponder se você mudar de país.</span>
                    </p>

                    <div className="relative z-50">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Novo Servidor</label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setServerDropdownOpen(!serverDropdownOpen)}
                                className="w-full bg-sidebar border border-white/5 rounded-lg py-3 px-4 outline-none focus:border-emerald-500/50 text-white font-medium flex items-center justify-between transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    {Object.values(SERVER_DATA).find((s: any) => s.domain === bulkTargetServer) && (
                                        <img
                                            src={getFlagAsset(Object.values(SERVER_DATA).find((s: any) => s.domain === bulkTargetServer)?.flag || '')}
                                            alt="flag"
                                            className="w-5 h-3.5 object-cover rounded shadow-sm"
                                        />
                                    )}
                                    <span>{Object.values(SERVER_DATA).find((s: any) => s.domain === bulkTargetServer)?.name || bulkTargetServer}</span>
                                </div>
                                <div className={`transition-transform duration-200 ${serverDropdownOpen ? 'rotate-180' : ''}`}>
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>

                            <AnimatePresence>
                                {serverDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-[#18181b] border border-white/10 rounded-xl shadow-xl max-h-[400px] overflow-y-auto custom-scrollbar z-[100]"
                                    >
                                        {Object.values(SERVER_DATA).map((server: any) => (
                                            <button
                                                key={server.domain}
                                                type="button"
                                                onClick={() => {
                                                    setBulkTargetServer(server.domain)
                                                    setServerDropdownOpen(false)
                                                }}
                                                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer ${bulkTargetServer === server.domain ? 'bg-white/5 text-emerald-500' : 'text-textMain'}`}
                                            >
                                                <img
                                                    src={getFlagAsset(server.flag)}
                                                    alt={server.flag}
                                                    className="w-5 h-3.5 object-cover rounded shadow-sm"
                                                />
                                                <span className="font-medium text-sm">{server.name}</span>
                                                {bulkTargetServer === server.domain && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {serverDropdownOpen && (
                            <div className="fixed inset-0 z-[-1]" onClick={() => setServerDropdownOpen(false)} />
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Mundo</label>
                        <div className="relative z-10">
                            <select
                                value={bulkTargetWorld}
                                onChange={(e) => setBulkTargetWorld(e.target.value)}
                                disabled={loadingBulkWorlds}
                                className="w-full bg-sidebar border border-white/5 rounded-lg py-3 px-4 outline-none focus:border-emerald-500/50 text-white font-medium cursor-pointer disabled:opacity-50"
                            >
                                <option value="" className="bg-[#111111]">Selecione o Mundo</option>
                                {Object.keys(bulkAvailableWorlds).map((prefix) => (
                                    <option key={prefix} value={prefix} className="bg-[#111111]">
                                        {prefix.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            {loadingBulkWorlds && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setShowBulkServerModal(false)}
                            className="px-4 py-2 rounded-lg text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleBulkServerUpdate}
                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
                        >
                            Confirmar Migração
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal: Add/Edit Account */}
            <Modal
                isOpen={showAddModal}
                onClose={() => { setShowAddModal(false); setEditingId(null); setFormData({ name: '', password: '', world: '', server: user?.preferences?.defaultServer || DEFAULT_SERVER, proxy: 'Sem Proxy', group: '', construction: '', recruitment: '', scavenge: false, premiumExchange: false, discordWebhook: '' }) }}
                title={editingId ? 'Editar Conta' : 'Nova Conta'}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleAddAccount} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Nome de Usuário</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-sidebar border border-white/5 rounded-lg py-3 px-4 outline-none focus:border-emerald-500/50 text-white placeholder-zinc-600 transition-all font-medium cursor-text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Jogador123"
                        />
                    </div>

                    <div className="relative">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Senha</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="w-full bg-sidebar border border-white/5 rounded-lg py-3 px-4 outline-none focus:border-emerald-500/50 text-white placeholder-zinc-600 transition-all font-medium cursor-text pr-12"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Servidor</label>
                            <div className={`relative ${addAccountServerDropdownOpen ? 'z-50' : 'z-20'}`}>
                                <button
                                    type="button"
                                    onClick={() => setAddAccountServerDropdownOpen(!addAccountServerDropdownOpen)}
                                    className="w-full bg-sidebar border border-white/5 rounded-lg py-3 px-4 outline-none focus:border-emerald-500/50 text-white font-medium flex items-center justify-between transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        {Object.values(SERVER_DATA).find((s: any) => s.domain === formData.server) && (
                                            <img
                                                src={getFlagAsset(Object.values(SERVER_DATA).find((s: any) => s.domain === formData.server)?.flag || '')}
                                                alt="flag"
                                                className="w-5 h-3.5 object-cover rounded shadow-sm"
                                            />
                                        )}
                                        <span>{Object.values(SERVER_DATA).find((s: any) => s.domain === formData.server)?.name || formData.server}</span>
                                    </div>
                                    <div className={`transition-transform duration-200 ${addAccountServerDropdownOpen ? 'rotate-180' : ''}`}>
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {addAccountServerDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-[#18181b] border border-white/10 rounded-xl shadow-xl max-h-[400px] overflow-y-auto custom-scrollbar z-[100]"
                                        >
                                            {Object.values(SERVER_DATA).sort((a, b) => a.name.localeCompare(b.name)).map(srv => (
                                                <button
                                                    key={srv.domain}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, server: srv.domain, world: '' })
                                                        setAddAccountServerDropdownOpen(false)
                                                    }}
                                                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer ${formData.server === srv.domain ? 'bg-white/5 text-emerald-500' : 'text-textMain'}`}
                                                >
                                                    <img
                                                        src={getFlagAsset(srv.flag)}
                                                        alt={srv.flag}
                                                        className="w-5 h-3.5 object-cover rounded shadow-sm"
                                                    />
                                                    <span className="font-medium text-sm">{srv.name}</span>
                                                    {formData.server === srv.domain && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {addAccountServerDropdownOpen && (
                                    <div className="fixed inset-0 z-[-1]" onClick={() => setAddAccountServerDropdownOpen(false)} />
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Mundo</label>
                            {loadingWorlds ? (
                                <div className="flex items-center gap-2 py-3 px-4 bg-sidebar border border-white/5 rounded-lg text-zinc-500 text-sm font-medium animate-pulse">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Carregando mundos...
                                </div>
                            ) : Object.keys(availableWorlds).length > 0 ? (
                                <div className="relative">
                                    <select
                                        className="w-full bg-sidebar border border-white/5 rounded-lg py-3 px-4 outline-none focus:border-emerald-500/50 text-white appearance-none cursor-pointer transition-all font-medium"
                                        value={formData.world}
                                        onChange={(e) => setFormData({ ...formData, world: e.target.value })}
                                        required
                                    >
                                        <option value="" className="bg-[#111111] text-zinc-500">Selecione um mundo...</option>
                                        {Object.keys(availableWorlds).map((prefix) => (
                                            <option key={prefix} value={prefix} className="bg-[#111111]">
                                                {prefix.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    </div>
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    className="w-full bg-sidebar border border-white/5 rounded-lg py-3 px-4 outline-none focus:border-emerald-500/50 text-white placeholder-zinc-600 transition-all font-medium cursor-text"
                                    value={formData.world}
                                    required
                                    onChange={(e) => setFormData({ ...formData, world: e.target.value })}
                                    placeholder="Ex: brs1 (Manual)"
                                />
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Proxy (Extremamente Recomendado)</label>
                        <CustomSelect
                            value={formData.proxy}
                            onChange={(val) => setFormData({ ...formData, proxy: val })}
                            options={[
                                { label: 'Sem Proxy (Usa IP da Máquina)', value: 'Sem Proxy' },
                                ...userProxies
                                    .filter(p => !accounts.some(acc => acc.proxy === p.address && acc._id !== editingId))
                                    .map((p) => ({ label: p.address.split(':')[0], value: p.address }))
                            ]}
                            placeholder="Selecione um Proxy"
                            borderColor="hover:border-emerald-500/30"
                            color="text-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Grupo / Etiqueta</label>
                        {uniqueGroups.length === 0 ? (
                            <div className="flex flex-col gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                                <span className="text-[10px] text-red-400 font-bold uppercase">Você não tem nenhum grupo criado</span>
                                <button
                                    type="button"
                                    onClick={() => navigateToTab?.('grupos')}
                                    className="text-xs bg-red-500 hover:bg-red-600 text-white font-black py-2 rounded-lg transition-all active:scale-95 cursor-pointer uppercase"
                                >
                                    Criar Meu Primeiro Grupo
                                </button>
                            </div>
                        ) : (
                            <CustomSelect
                                value={formData.group}
                                onChange={(val) => setFormData({ ...formData, group: val })}
                                options={uniqueGroups.map(g => ({
                                    label: g,
                                    value: g,
                                    color: groupColors[g]
                                }))}
                                placeholder="Selecione um Grupo"
                                renderOption={(opt: any) => (
                                    <div className="flex items-center gap-2">
                                        {opt.color ? (
                                            <div
                                                className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                                                style={{ backgroundColor: opt.color }}
                                            />
                                        ) : (
                                            <div className="w-2 h-2 rounded-full bg-zinc-600" />
                                        )}
                                        <span className={opt.color ? '' : 'text-zinc-400'}>{opt.label}</span>
                                    </div>
                                )}
                            />
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Webhook Discord (Notificações)</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full bg-sidebar border border-white/5 rounded-lg py-3 px-4 outline-none focus:border-emerald-500/50 text-white placeholder-zinc-600 transition-all font-medium cursor-text pl-10"
                                value={formData.discordWebhook}
                                onChange={(e) => setFormData({ ...formData, discordWebhook: e.target.value })}
                                placeholder="https://discord.com/api/webhooks/..."
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-1 pl-1">
                            Cole a URL do Webhook para receber avisos de Captcha.
                        </p>
                    </div>

                    {/* Strategy Settings */}
                    <div className="pt-4 border-t border-white/5 space-y-4">
                        <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest pl-1">Funcionalidades</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Modelo de Construção</label>
                                <div className="relative">
                                    <CustomSelect
                                        value={formData.construction}
                                        onChange={(val) => setFormData({ ...formData, construction: val })}
                                        options={[
                                            { label: 'Desativado', value: '' },
                                            ...constructionModels.map(m => ({ label: m.name, value: m.uuid }))
                                        ]}
                                        placeholder="Desativado"
                                        icon={Hammer}
                                        borderColor="hover:border-emerald-500/30"
                                        color="text-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Modelo de Recrutamento</label>
                                <div className="relative">
                                    <CustomSelect
                                        value={formData.recruitment}
                                        onChange={(val) => setFormData({ ...formData, recruitment: val })}
                                        options={[
                                            { label: 'Desativado', value: '' },
                                            ...recruitmentModels.map(m => ({ label: m.name, value: m.uuid }))
                                        ]}
                                        placeholder="Desativado"
                                        icon={Users}
                                        borderColor="hover:border-emerald-500/30"
                                        color="text-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, scavenge: !formData.scavenge })}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${formData.scavenge ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-black/20 border-white/5 text-zinc-500 hover:bg-white/5'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">Coleta Ativa</span>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${formData.scavenge ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-zinc-800'}`} />
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, premiumExchange: !formData.premiumExchange })}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${formData.premiumExchange ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-black/20 border-white/5 text-zinc-500 hover:bg-white/5'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">Troca PP Ativa</span>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${formData.premiumExchange ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-zinc-800'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => { setShowAddModal(false); setEditingId(null); setFormData({ name: '', password: '', world: '', server: user?.preferences?.defaultServer || DEFAULT_SERVER, proxy: 'Sem Proxy', group: '', construction: '', recruitment: '', scavenge: false, premiumExchange: false, discordWebhook: '' }) }}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-white transition-all text-sm cursor-pointer"
                        >
                            CANCELAR
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold text-white shadow-lg shadow-emerald-600/20 transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
                        >
                            {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            {editingId ? 'SALVAR ALTERAÇÕES' : 'CRIAR CONTA'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Confirmação Auto Atribuir */}
            <Modal
                isOpen={autoAssignConfirm}
                onClose={() => setAutoAssignConfirm(false)}
                title="Atribuição Automática de Proxies"
                maxWidth="max-w-2xl"
            >
                <div className="space-y-4">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-3">
                        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-200">
                            O sistema tentará atribuir proxies disponíveis para contas que estão sem proxy.
                        </p>
                    </div>

                    <p className="text-textMuted">
                        Deseja permitir a reutilização de proxies em mundos diferentes?
                    </p>

                    <div className="flex flex-col gap-3 mt-4">
                        <button
                            onClick={() => handleAutoAssignProxies(true)}
                            className="bg-green-600 hover:bg-green-500 text-white p-4 rounded-xl font-medium transition-all shadow-lg shadow-green-600/20 hover:shadow-green-500/30 flex items-center justify-center gap-3 w-full cursor-pointer hover:-translate-y-0.5"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-base">Sim, permitir reutilização (Recomendado)</span>
                        </button>
                        <button
                            onClick={() => handleAutoAssignProxies(false)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-xl font-medium transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 flex items-center justify-center gap-3 w-full cursor-pointer hover:-translate-y-0.5"
                        >
                            <Shield className="w-5 h-5" />
                            <span className="text-base">Não, usar apenas proxies novos</span>
                        </button>
                        <button
                            onClick={() => setAutoAssignConfirm(false)}
                            className="bg-white/5 hover:bg-white/10 text-textMuted hover:text-white p-4 rounded-xl font-medium transition-all border border-white/5 hover:border-white/10 w-full cursor-pointer"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Confirmação Geral */}
            <ConfirmationModal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                title={confirmState.title}
                message={confirmState.message}
                variant={confirmState.variant}
                onConfirm={confirmState.onConfirm}
                confirmText="Confirmar"
            />

            {/* Modal: Bulk Add Accounts */}
            <Modal
                isOpen={showBulkAddModal}
                onClose={() => setShowBulkAddModal(false)}
                title="Adicionar Contas em Massa"
                maxWidth="max-w-5xl"
            >
                <form onSubmit={handleBulkAdd} className="p-6 space-y-4">

                    {/* Header Info */}
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-4">
                        <Info className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-emerald-500">Adição Inteligente</h4>
                            <p className="text-xs text-zinc-400">
                                Cole contas no formato <span className="text-white font-mono bg-white/10 px-1 rounded">user|pass</span> ou <span className="text-white font-mono bg-white/10 px-1 rounded">user|pass|world</span>.
                                <br />
                                Clique em <b>Processar</b> para revisar a lista. Você pode definir mundos diferentes para cada linha.
                            </p>
                        </div>
                    </div>

                    {/* Section 1: Input Buffer & Defaults */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Colar Contas</label>
                                <button type="button" onClick={handleProcessBuffer} className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 px-3 py-1.5 rounded-lg font-bold transition-all border border-emerald-500/20 active:scale-95 cursor-pointer">
                                    Processar Texto
                                </button>
                            </div>
                            <textarea
                                className="w-full h-24 bg-sidebar border border-white/5 rounded-xl p-3 outline-none focus:border-emerald-500/50 text-white placeholder-zinc-600 transition-all font-mono text-sm resize-none custom-scrollbar"
                                placeholder="Usuario1|Senha1&#10;Usuario2|Senha2|br120"
                                value={bulkAddData.accountsRaw}
                                onChange={(e) => setBulkAddData({ ...bulkAddData, accountsRaw: e.target.value })}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                        handleProcessBuffer()
                                    }
                                }}
                            />
                        </div>

                        {/* Defaults for new lines */}
                        <div className="grid grid-cols-3 gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="col-span-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Settings className="w-3 h-3" /> Padrões (Aplicados ao Processar)
                            </div>

                            {/* Global Server */}
                            <div className={`relative bulk-server-dropdown-container ${bulkAddServerDropdownOpen ? 'z-50' : 'z-20'}`}>
                                <button
                                    type="button"
                                    onClick={() => setBulkAddServerDropdownOpen(!bulkAddServerDropdownOpen)}
                                    className="w-full bg-[#111] border border-white/10 rounded-lg py-2 px-3 outline-none focus:border-emerald-500/50 text-white font-medium flex items-center justify-between text-xs cursor-pointer"
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        {Object.values(SERVER_DATA).find((s: any) => s.domain === bulkAddData.server) && (
                                            <img src={getFlagAsset(Object.values(SERVER_DATA).find((s: any) => s.domain === bulkAddData.server)?.flag || '')} alt="flag" className="w-3.5 h-2.5 rounded shadow-sm" />
                                        )}
                                        <span className="truncate">{Object.values(SERVER_DATA).find((s: any) => s.domain === bulkAddData.server)?.name || bulkAddData.server}</span>
                                    </div>
                                    <ChevronDown className="w-3 h-3 opacity-50" />
                                </button>
                                {/* Dropdown Logic reused or implied? Need full render for robustness */}
                                <AnimatePresence>
                                    {bulkAddServerDropdownOpen && (
                                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 right-0 mt-1 bg-[#18181b] border border-white/10 rounded-xl shadow-xl max-h-[200px] overflow-y-auto custom-scrollbar z-[100]">
                                            {Object.values(SERVER_DATA).sort((a: any, b: any) => a.name.localeCompare(b.name)).map((server: any) => (
                                                <button key={server.domain} type="button" onClick={() => { setBulkAddData({ ...bulkAddData, server: server.domain, world: '' }); setBulkAddServerDropdownOpen(false) }} className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-white/5 cursor-pointer ${bulkAddData.server === server.domain ? 'text-emerald-500' : 'text-zinc-300'}`}>
                                                    <img src={getFlagAsset(server.flag)} alt={server.flag} className="w-3.5 h-2.5 rounded" />
                                                    <span className="text-xs">{server.name}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Global World */}
                            <div className="relative">
                                {loadingBulkWorlds ? (
                                    <div className="flex items-center gap-2 py-2 px-3 bg-[#111] border border-white/10 rounded-lg text-zinc-500 text-xs animate-pulse"><Loader2 className="w-3 h-3 animate-spin" /> ...</div>
                                ) : Object.keys(bulkAvailableWorlds).length > 0 ? (
                                    <select
                                        className="w-full bg-[#111] border border-white/10 rounded-lg py-2 px-3 outline-none focus:border-emerald-500/50 text-white text-xs appearance-none cursor-pointer"
                                        value={bulkAddData.world}
                                        onChange={(e) => setBulkAddData({ ...bulkAddData, world: e.target.value })}
                                    >
                                        <option value="">Padrão...</option>
                                        {Object.keys(bulkAvailableWorlds).map((prefix) => (
                                            <option key={prefix} value={prefix}>{prefix.toUpperCase()}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        className="w-full bg-[#111] border border-white/10 rounded-lg py-2 px-3 outline-none focus:border-emerald-500/50 text-white text-xs placeholder-zinc-600"
                                        value={bulkAddData.world}
                                        onChange={(e) => setBulkAddData({ ...bulkAddData, world: e.target.value })}
                                        placeholder="Mundo (Ex: br120)"
                                    />
                                )}
                            </div>

                            {/* Global Group */}
                            <input type="text" placeholder="Grupo (Opcional)" className="w-full bg-[#111] border border-white/10 rounded-lg py-2 px-3 outline-none focus:border-emerald-500/50 text-white text-xs placeholder-zinc-600" value={bulkAddData.group} onChange={(e) => setBulkAddData({ ...bulkAddData, group: e.target.value })} />
                        </div>
                    </div>

                    {/* Section 2: List */}
                    {parsedAccounts.length > 0 && (
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Lista Final ({parsedAccounts.length})</label>
                                <button type="button" onClick={() => setParsedAccounts([])} className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase transition-colors">Limpar Lista</button>
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar border border-white/5 rounded-xl bg-black/20">
                                {/* List Header */}
                                <div className="grid grid-cols-12 gap-2 p-2 border-b border-white/5 text-[10px] uppercase font-bold text-zinc-600 bg-white/5">
                                    <div className="col-span-3 pl-2">Servidor</div>
                                    <div className="col-span-3">Mundo</div>
                                    <div className="col-span-2">Usuário</div>
                                    <div className="col-span-3">Senha</div>
                                    <div className="col-span-1 text-right pr-2"></div>
                                </div>
                                {parsedAccounts.map((acc) => (
                                    <div key={acc.tempId} className="grid grid-cols-12 gap-2 p-2 border-b border-white/5 items-center hover:bg-white/5 transition-colors group text-xs animate-in slide-in-from-left-2 duration-300">

                                        {/* Custom Server Selector */}
                                        <div className={`col-span-3 relative row-dropdown-container ${rowDropdown?.id === acc.tempId ? 'z-50' : 'z-20'}`}>
                                            <button
                                                type="button"
                                                onClick={() => setRowDropdown(rowDropdown?.id === acc.tempId && rowDropdown?.type === 'server' ? null : { id: acc.tempId, type: 'server' })}
                                                className="w-full bg-[#111] border border-white/5 hover:border-white/10 rounded px-2 py-1.5 flex items-center justify-between text-[11px] transition-all cursor-pointer"
                                            >
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    {Object.values(SERVER_DATA).find((s: any) => s.domain === acc.server) && (
                                                        <img src={getFlagAsset(Object.values(SERVER_DATA).find((s: any) => s.domain === acc.server)?.flag || '')} className="w-3.5 h-2.5 rounded shadow-sm" />
                                                    )}
                                                    <span className="truncate">{Object.values(SERVER_DATA).find((s: any) => s.domain === acc.server)?.name}</span>
                                                </div>
                                                <ChevronDown className="w-3 h-3 opacity-30" />
                                            </button>
                                            {/* Lazy Dropdown */}
                                            {rowDropdown?.id === acc.tempId && rowDropdown?.type === 'server' && (
                                                <div className="absolute top-full left-0 w-[250px] mt-1 bg-[#18181b] border border-white/10 rounded-xl shadow-xl max-h-[300px] overflow-y-auto custom-scrollbar z-[100] transform translate-y-1">
                                                    {Object.values(SERVER_DATA).sort((a: any, b: any) => a.name.localeCompare(b.name)).map((server: any) => (
                                                        <button key={server.domain} type="button" onClick={() => { updateParsedAccount(acc.tempId, 'server', server.domain); setRowDropdown(null) }} className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-white/5 cursor-pointer ${acc.server === server.domain ? 'text-emerald-500' : 'text-zinc-300'}`}>
                                                            <img src={getFlagAsset(server.flag)} className="w-3.5 h-2.5 rounded" />
                                                            <span className="text-xs">{server.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Custom World Selector */}
                                        <div className="col-span-3 relative row-dropdown-container">
                                            {worldCache[acc.server] && Object.keys(worldCache[acc.server]).length > 0 ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => setRowDropdown(rowDropdown?.id === acc.tempId && rowDropdown?.type === 'world' ? null : { id: acc.tempId, type: 'world' })}
                                                        className="w-full bg-[#111] border border-white/5 hover:border-white/10 rounded px-2 py-1.5 flex items-center justify-between text-[11px] font-mono text-emerald-500 transition-all cursor-pointer"
                                                    >
                                                        <span className="truncate">{acc.worldPrefix ? acc.worldPrefix.toUpperCase() : '...'}</span>
                                                        <ChevronDown className="w-3 h-3 opacity-30 text-white flex-shrink-0" />
                                                    </button>
                                                    {rowDropdown?.id === acc.tempId && rowDropdown?.type === 'world' && (
                                                        <div className="absolute top-full left-0 w-full min-w-[200px] mt-1 bg-[#18181b] border border-white/10 rounded-xl shadow-xl max-h-[300px] overflow-y-auto custom-scrollbar z-[100] transform translate-y-1">
                                                            {Object.keys(worldCache[acc.server]).map(prefix => (
                                                                <button key={prefix} type="button" onClick={() => { updateParsedAccount(acc.tempId, 'worldPrefix', prefix); setRowDropdown(null) }} className={`w-full text-left px-3 py-1.5 hover:bg-white/5 text-xs font-mono cursor-pointer ${acc.worldPrefix === prefix ? 'text-emerald-500' : 'text-zinc-400'}`}>
                                                                    {prefix.toUpperCase()}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="w-full bg-[#111] border border-white/5 hover:border-white/10 rounded px-2 py-1 flex items-center text-[11px] font-mono text-emerald-500 outline-none focus:border-emerald-500/50"
                                                    value={acc.worldPrefix || ''}
                                                    onChange={(e) => updateParsedAccount(acc.tempId, 'worldPrefix', e.target.value)}
                                                    placeholder="Mundo..."
                                                />
                                            )}
                                        </div>

                                        {/* Name */}
                                        <div className="col-span-2">
                                            <input type="text" value={acc.name} onChange={(e) => updateParsedAccount(acc.tempId, 'name', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-emerald-500/50 text-white p-1 focus:ring-0 placeholder-zinc-700 transition-colors" placeholder="Usuário" />
                                        </div>
                                        {/* Pass */}
                                        <div className="col-span-3">
                                            <input type="text" value={acc.password} onChange={(e) => updateParsedAccount(acc.tempId, 'password', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-emerald-500/50 text-zinc-400 p-1 focus:ring-0 font-mono placeholder-zinc-700 transition-colors" placeholder="Senha" />
                                        </div>
                                        {/* Delete */}
                                        <div className="col-span-1 flex justify-end pr-1">
                                            <button type="button" onClick={() => removeParsedAccount(acc.tempId)} className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-red-500 transition-all rounded hover:bg-red-500/10 cursor-pointer">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setShowBulkAddModal(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-white transition-all text-sm cursor-pointer">
                            CANCELAR
                        </button>
                        <button type="submit" disabled={isBulkAdding || (parsedAccounts.length === 0 && !bulkAddData.accountsRaw)} className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-bold text-white shadow-lg shadow-indigo-600/20 transition-all text-sm cursor-pointer flex items-center justify-center gap-2">
                            {isBulkAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            {isBulkAdding ? 'SALVANDO...' : parsedAccounts.length > 0 ? `SALVAR ${parsedAccounts.length} CONTAS` : 'ADICIONAR'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Global Account Options Menu */}
            {openMenuId && menuPosition && (
                (() => {
                    const acc = accounts.find(a => a._id === openMenuId);
                    if (!acc) return null;
                    return createPortal(
                        <>
                            <div
                                className="fixed inset-0 z-[100]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                }}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                }}
                            ></div>
                            <div
                                style={{
                                    position: 'fixed',
                                    left: Math.max(8, Math.min(menuPosition.x, window.innerWidth - 200)),
                                    zIndex: 101,
                                    // If menu goes off bottom, flip it
                                    ...(menuPosition.y > window.innerHeight - 250 ? {
                                        bottom: window.innerHeight - menuPosition.y + 4
                                    } : {
                                        top: menuPosition.y + 4
                                    })
                                }}
                                className={`w-48 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl p-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="px-3 py-2 border-b border-white/5 mb-1">
                                    <p className="text-[10px] font-bold text-textMuted uppercase tracking-wider">Ações da Conta -  {acc.name} - {acc.worldPrefix}</p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleLoginAccount(acc._id)
                                        setOpenMenuId(null)
                                    }}
                                    disabled={isLoggingIn(acc._id)}
                                    className="w-full text-left px-3 py-2.5 text-xs font-bold text-white hover:bg-white/5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
                                >
                                    {isLoggingIn(acc._id) ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> : <LogIn className="w-3.5 h-3.5 text-primary" />}
                                    Entrar na Conta
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleEditAccount(acc)
                                        setOpenMenuId(null)
                                    }}
                                    className="w-full text-left px-3 py-2.5 text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
                                >
                                    <Pencil className="w-3.5 h-3.5" /> Editar Configurações
                                </button>
                                <div className="h-px bg-white/5 my-1 mx-2"></div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteRequest(acc._id)
                                        setOpenMenuId(null)
                                    }}
                                    className="w-full text-left px-3 py-2.5 text-xs font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Excluir Conta
                                </button>
                            </div>
                        </>,
                        document.body
                    );
                })()
            )}
        </div>
    )
}

export default Accounts
