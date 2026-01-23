import React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'success' | 'info'
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'info'
}) => {
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#111111] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-xl relative overflow-hidden"
                    >
                        {/* Decorative Background */}
                        <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] pointer-events-none ${variant === 'danger' ? 'bg-red-500/20' : 'bg-zinc-500/20'}`} />

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg ${variant === 'danger' ? 'bg-red-500/10 text-red-500 shadow-red-500/10' :
                                variant === 'success' ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10' :
                                    'bg-zinc-500/10 text-zinc-400 shadow-zinc-500/10'
                                }`}>
                                {variant === 'danger' ? <AlertTriangle className="w-6 h-6" /> :
                                    variant === 'success' ? <CheckCircle2 className="w-6 h-6" /> :
                                        <AlertTriangle className="w-6 h-6" />}
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{title}</h3>
                            <p className="text-zinc-400 text-xs font-medium leading-relaxed mb-6">
                                {message}
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-2.5 bg-[#334155] rounded-lg font-bold text-xs text-zinc-400 hover:text-white border border-white/5 hover:bg-[#475569] transition-all cursor-pointer"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm()
                                        onClose()
                                    }}
                                    className={`flex-1 py-2.5 rounded-lg font-bold text-xs text-white shadow-lg transition-all cursor-pointer ${variant === 'danger' ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20' :
                                        variant === 'success' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' :
                                            'bg-zinc-700 hover:bg-zinc-600 shadow-black/20'
                                        }`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    )
}

export default ConfirmationModal
