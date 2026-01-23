import React, { useState } from 'react'
import { User, LogOut, ShieldCheck, CreditCard, Bell, Sliders, LayoutGrid, Terminal, Menu, X, Tags, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

interface NavbarProps {
    activeTab: string
    setActiveTab: (tab: string) => void
    onLogout: () => void
    user: any
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onLogout, user }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const menuItems = [
        { id: 'contas', label: 'Contas', icon: User },
        { id: 'proxies', label: 'Proxies', icon: ShieldCheck },
        { id: 'grupos', label: 'Grupos', icon: Tags },
        { id: 'scripts', label: 'Scripts', icon: Terminal },
        { id: 'planos', label: 'Preços', icon: CreditCard },
        { id: 'modelos', label: 'Modelos', icon: Sliders },
        { id: 'atalhos', label: 'Padrões', icon: LayoutGrid },
        { id: 'notificacoes', label: 'Notificações', icon: Bell, badge: '' },
        { id: 'configuracoes', label: 'Configurações', icon: Settings },
    ]

    return (
        <div className="w-full px-6 pt-6 pb-2 z-50 relative">
            <div className="w-full md:h-[72px] h-auto bg-[#121214]/80 backdrop-blur-xl border border-white/5 rounded-2xl flex flex-col md:flex-row items-center justify-between px-6 py-3 md:py-0 shadow-2xl relative transition-all duration-300">

                {/* Header Row (User + Mobile Toggle) */}
                <div className="w-full md:w-auto flex items-center justify-between">
                    {/* User Profile (Left) */}
                    <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="relative group cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-black p-[1px] group-hover:from-emerald-500/50 group-hover:to-emerald-900/50 transition-all duration-500">
                                <div className="w-full h-full rounded-[11px] bg-[#121214] flex items-center justify-center overflow-hidden relative">
                                    {user?.avatar ? (
                                        <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
                                    ) : (
                                        <User className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                                    )}
                                </div>
                            </div>
                            {/* Status Dot */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#121214] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1 group-hover:text-emerald-500/50 transition-colors">Operator</span>
                            <span className="text-sm font-bold text-white tracking-tight leading-none text-shadow-sm">{user?.fullName?.split(' ')[0] || 'User'}</span>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Desktop Navigation (Center) */}
                <nav className="hidden md:flex items-center gap-1 bg-black/20 p-1.5 rounded-xl border border-white/5 mx-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.id

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    "relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer",
                                    isActive ? "text-emerald-400" : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <div className="relative">
                                    <Icon className={cn("w-4 h-4 relative z-10", isActive && "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]")} />
                                    {item.badge && (
                                        <span className="absolute -top-2 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-[#121214] animate-pulse z-20">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs font-bold tracking-wide relative z-10 uppercase">{item.label}</span>
                            </button>
                        )
                    })}
                </nav>

                {/* Desktop Logout (Right) */}
                <div className="hidden md:flex min-w-[200px] justify-end">
                    <button
                        onClick={onLogout}
                        className="group flex items-center gap-2 px-4 py-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 border border-transparent hover:border-red-500/10 cursor-pointer"
                    >
                        <span className="text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">Sair</span>
                        <LogOut className="w-4 h-4 transition-transform group-hover:rotate-12" />
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="w-full md:hidden overflow-hidden flex flex-col gap-2 pt-4 border-t border-white/5 mt-2"
                        >
                            {menuItems.map((item) => {
                                const Icon = item.icon
                                const isActive = activeTab === item.id

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id)
                                            setMobileMenuOpen(false)
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full cursor-pointer",
                                            isActive
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : "text-gray-400 hover:bg-white/5"
                                        )}
                                    >
                                        <div className="relative">
                                            <Icon className="w-5 h-5" />
                                            {item.badge && (
                                                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-[#121214]">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm font-bold uppercase tracking-wider">{item.label}</span>
                                    </button>
                                )
                            })}

                            <div className="h-px bg-white/5 my-2"></div>

                            <button
                                onClick={onLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 w-full cursor-pointer"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="text-sm font-bold uppercase tracking-wider">Sair</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    )
}

export default Navbar
