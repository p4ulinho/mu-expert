import React from 'react'
import { Plus } from 'lucide-react'

interface ScriptSectionProps {
    title: string
    subtitle: string
    icon?: React.ElementType
    onAction?: () => void
    actionLabel?: string
    headerActions?: React.ReactNode
    children: React.ReactNode
}

export const ScriptSection: React.FC<ScriptSectionProps> = ({ title, subtitle, icon: Icon, onAction, actionLabel, headerActions, children }) => {
    return (
        <div className="bg-[#111113] border border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {Icon && (
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                            <Icon className="w-5 h-5 text-yellow-500" />
                        </div>
                    )}
                    <div>
                        <h2 className="text-lg font-bold text-white">{title}</h2>
                        <p className="text-zinc-500 text-xs font-medium">{subtitle}</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {headerActions}
                    {onAction && actionLabel && (
                        <button
                            onClick={onAction}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 text-xs uppercase tracking-wider"
                        >
                            <Plus className="w-4 h-4" /> {actionLabel}
                        </button>
                    )}
                </div>
            </div>
            {children}
            <div className="h-4"></div> {/* Bottom spacer */}
        </div>
    )
}
