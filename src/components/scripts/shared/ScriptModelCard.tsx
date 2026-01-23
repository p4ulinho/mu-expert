import React from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface ScriptModelCardProps {
    title: string
    onEdit: () => void
    onDelete: () => void
    children: React.ReactNode
}

export const ScriptModelCard: React.FC<ScriptModelCardProps> = ({ title, onEdit, onDelete, children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#18181b] border border-white/5 rounded-xl p-4 hover:border-yellow-500/30 transition-all group relative overflow-hidden"
        >
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="mb-1 max-w-[60%]">
                        <h3 className="font-bold text-white text-base truncate" title={title}>{title}</h3>
                        <div className="h-0.5 w-8 bg-yellow-500 mt-2 rounded-full opacity-50"></div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit() }}
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-zinc-300 hover:text-white transition-colors flex items-center gap-2 border border-white/5 shadow-sm"
                        >
                            <Edit2 className="w-3.5 h-3.5" /> Editar
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete() }}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-xs font-bold text-red-500 hover:text-red-400 transition-colors flex items-center gap-2 border border-red-500/10 shadow-sm"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> Remover
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {children}
                </div>
            </div>
        </motion.div>
    )
}
