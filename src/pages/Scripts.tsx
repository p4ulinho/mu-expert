import React, { useState } from 'react'
import { Hammer, Users, Package, RefreshCw, ChevronRight, Zap, Compass } from 'lucide-react'
import RecruitmentConfig from '../components/scripts/RecruitmentConfig'
import ConstructionConfig from '../components/scripts/ConstructionConfig'
import ScavengeConfig from '../components/scripts/ScavengeConfig'
import PremiumExchangeConfig from '../components/scripts/PremiumExchangeConfig'
import RelocateConfig from '../components/scripts/RelocateConfig'
import { motion, AnimatePresence } from 'framer-motion'

interface ScriptsProps {
    user: any
    updateUser: (user: any) => void
}

const Scripts: React.FC<ScriptsProps> = ({ user, updateUser }) => {
    const [activeSubTab, setActiveSubTab] = useState<'construcao' | 'recrutamento' | 'coleta' | 'troca' | 'reposicionar'>('construcao')

    const subTabs = [
        {
            id: 'construcao',
            label: 'Construção',
            icon: Hammer,
            desc: 'Gerencie filas e modelos de construção',
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/50'
        },
        {
            id: 'recrutamento',
            label: 'Recrutamento',
            icon: Users,
            desc: 'Automatize o recrutamento de unidades',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/50'
        },
        {
            id: 'coleta',
            label: 'Coleta',
            icon: Package,
            desc: 'Envie coletas de recursos automaticamente',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/50'
        },
        {
            id: 'troca',
            label: 'Troca Premium',
            icon: RefreshCw,
            desc: 'Negocie recursos no mercado premium',
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/50'
        },
        {
            id: 'reposicionar',
            label: 'Reposicionar',
            icon: Compass,
            desc: 'Automatize o reposicionamento da aldeia',
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/50'
        },
    ]

    return (
        <div className="h-full flex flex-col overflow-hidden animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="mb-8 flex-shrink-0">
                <h1 className="text-4xl font-black italic tracking-tighter text-white flex items-center gap-3">
                    <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                    AUTOMAÇÃO
                </h1>
                <p className="text-zinc-500 mt-1 max-w-2xl text-lg">
                    Configure cada script da melhor forma para atender suas necessidades.
                </p>
            </div>

            {/* Main Content Area - Grid Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 min-h-0">

                {/* Sidebar Navigation */}
                <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                    {subTabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeSubTab === tab.id

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSubTab(tab.id as any)}
                                className={`cursor-pointer group relative flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-300 border ${isActive
                                    ? `bg-[#18181b] border-white/10 shadow-2xl scale-[1.02]`
                                    : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                                    }`}
                            >
                                {/* Active Indicator Bar */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${tab.color.replace('text-', 'bg-')}`}
                                    />
                                )}

                                {/* Icon Box */}
                                <div className={`p-3 rounded-lg transition-colors duration-300 ${isActive ? tab.bg : 'bg-zinc-900 group-hover:bg-zinc-800'}`}>
                                    <Icon className={`w-6 h-6 ${isActive ? tab.color : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                                </div>

                                {/* Text Content */}
                                <div className="flex-1">
                                    <div className={`font-bold text-base mb-0.5 flex items-center justify-between ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>
                                        {tab.label}
                                        {isActive && <ChevronRight className={`w-4 h-4 ${tab.color}`} />}
                                    </div>
                                    <div className="text-xs text-zinc-600 leading-tight group-hover:text-zinc-500">
                                        {tab.desc}
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>

                {/* Configuration Panel */}
                <div className="bg-[#111113] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-2xl flex flex-col min-h-0">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.02]"
                        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                    />

                    <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSubTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                            >
                                {activeSubTab === 'construcao' && <ConstructionConfig user={user} updateUser={updateUser} />}
                                {activeSubTab === 'recrutamento' && <RecruitmentConfig user={user} updateUser={updateUser} />}
                                {activeSubTab === 'coleta' && <ScavengeConfig user={user} updateUser={updateUser} />}
                                {activeSubTab === 'troca' && <PremiumExchangeConfig user={user} updateUser={updateUser} />}
                                {activeSubTab === 'reposicionar' && <RelocateConfig user={user} updateUser={updateUser} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Scripts
