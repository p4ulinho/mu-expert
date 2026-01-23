import React from 'react'
import { Settings } from 'lucide-react'

interface ScriptSettingsCardProps {
    title: string
    description: string
    children: React.ReactNode
}

export const ScriptSettingsCard: React.FC<ScriptSettingsCardProps> = ({ title, description, children }) => {
    return (
        <div className="bg-[#111113] border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                    <Settings className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                    <p className="text-zinc-500 text-xs font-medium">{description}</p>
                </div>
            </div>
            {children}
        </div>
    )
}
