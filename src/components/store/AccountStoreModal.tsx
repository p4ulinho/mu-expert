import React, { useState } from 'react'
import { Check, ShoppingCart, X, Copy, QrCode, ShieldCheck, Zap, ChevronRight, ArrowLeft, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface AccountStoreModalProps {
    isOpen: boolean
    onClose: () => void
    unitPrice: number
}

interface Plan {
    id: string
    name: string
    count: number
    features: string[]
    recommended?: boolean
    color: string
}

export const AccountStoreModal: React.FC<AccountStoreModalProps> = ({ isOpen, onClose, unitPrice }) => {
    const [step, setStep] = useState<'plans' | 'payment'>('plans')
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
    const [quantity, setQuantity] = useState(1)

    const handleSelectPlan = (plan: Plan) => {
        setSelectedPlan(plan)
        setStep('payment')
    }

    const handleCopyPix = () => {
        navigator.clipboard.writeText("00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913MultiExpert6008Sao Paulo62070503***6304E123")
        toast.success("Código Pix copiado!")
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-4xl bg-[#111111] border border-white/5 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#18181b]/50">
                    <div className="flex items-center gap-4">
                        {step === 'payment' && (
                            <button
                                onClick={() => setStep('plans')}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-emerald-500" />
                                Loja de Contas
                            </h2>
                            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                                {step === 'plans' ? 'Escolha o pacote ideal' : 'Finalizar Pagamento'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                    <AnimatePresence mode="wait">
                        {step === 'plans' ? (
                            <motion.div
                                key="plans"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex flex-col gap-6"
                            >
                                <div className="bg-[#18181b] border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
                                    {/* Background Decoration */}
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                        <ShoppingCart className="w-64 h-64 rotate-12" />
                                    </div>

                                    <div className="relative z-10 space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-emerald-600/10 rounded-xl">
                                                <User className="w-8 h-8 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white uppercase tracking-tighter leading-none">CONFIGURAR PEDIDO</h3>
                                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.15em] mt-1">TOTALMENTE CUSTOMIZÁVEL</p>
                                            </div>
                                        </div>

                                        {/* Price Stats */}
                                        <div className="flex justify-between items-end border-b border-white/5 pb-6">
                                            <div>
                                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Valor Unitário</p>
                                                <div className="flex items-end gap-2">
                                                    <span className="text-4xl font-black text-white">R$ {unitPrice.toFixed(2).replace('.', ',')}</span>
                                                    <span className="text-xs font-bold text-zinc-500 mb-2">/conta</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Entrega</p>
                                                <span className="text-lg font-bold text-emerald-500">Imediata</span>
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-bold text-zinc-300 uppercase tracking-wide">Quantidade de Contas</label>
                                                <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wider">
                                                    {quantity} {quantity === 1 ? 'CONTA' : 'CONTAS'}
                                                </span>
                                            </div>

                                            <input
                                                type="range"
                                                min="1"
                                                max="100"
                                                step="1"
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600 hover:accent-emerald-500 transition-all"
                                            />

                                            <div className="flex justify-between text-xs font-medium text-zinc-600 uppercase tracking-wider">
                                                <span>1</span>
                                                <span>50</span>
                                                <span>100</span>
                                            </div>
                                        </div>

                                        {/* Total & Action */}
                                        <div className="pt-4 flex items-center justify-between gap-6">
                                            <div className="bg-[#0f172a]/50 p-4 rounded-xl border border-white/5 flex-1 flex items-center justify-between">
                                                <span className="font-bold text-zinc-400 text-sm uppercase tracking-wider">Total a Pagar:</span>
                                                <span className="text-3xl font-black text-white">R$ {(quantity * unitPrice).toFixed(2).replace('.', ',')}</span>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    // Create a makeshift plan object to pass to payment step
                                                    const customPlan: Plan = {
                                                        id: 'custom',
                                                        name: 'Pacote Personalizado',
                                                        count: quantity,
                                                        features: ['Entrega Imediata', 'Garantia Total', 'Suporte VIP'],
                                                        color: 'emerald',
                                                        recommended: true
                                                    }
                                                    handleSelectPlan(customPlan)
                                                }}
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold text-white text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 group"
                                            >
                                                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                AVANÇAR PARA PAGAMENTO
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="payment"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col md:flex-row gap-8"
                            >
                                {/* Left: Summary */}
                                <div className="flex-1 space-y-6">
                                    <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6">
                                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Resumo do Pedido</h3>
                                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                                            <div>
                                                <div className="text-white font-bold text-lg">{selectedPlan?.name}</div>
                                                <div className="text-zinc-500 text-sm">{selectedPlan?.count} Contas</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-emerald-500 font-bold text-xl">
                                                    R$ {(selectedPlan!.count * unitPrice).toFixed(2).replace('.', ',')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {selectedPlan?.features.map((f, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-zinc-500">
                                                    <Check className="w-3 h-3 text-emerald-500" /> {f}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-3">
                                        <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-bold text-emerald-500 mb-1">Pagamento Seguro via Pix</h4>
                                            <p className="text-xs text-zinc-400 leading-relaxed">
                                                Seu pagamento é processado instantaneamente. A entrega das contas é feita automaticamente após a confirmação.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Payment Action */}
                                <div className="flex-1 bg-[#18181b] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center">
                                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-6">Escaneie o QR Code</h3>

                                    <div className="p-4 bg-white rounded-xl mb-6 shadow-xl">
                                        {/* Mock QR Code - In a real app, generate based on Pix payload */}
                                        <QrCode className="w-48 h-48 text-black" />
                                    </div>

                                    <div className="w-full space-y-3">
                                        <button
                                            onClick={handleCopyPix}
                                            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all group"
                                        >
                                            <Copy className="w-4 h-4 group-hover:text-emerald-500 transition-colors" />
                                            Copiar Código Pix
                                        </button>

                                        <button
                                            onClick={() => {
                                                toast.success("Pagamento confirmado! Suas contas serão entregues em breve.")
                                                onClose()
                                            }}
                                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                                        >
                                            <Zap className="w-4 h-4 fill-current" />
                                            Já fiz o pagamento
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}
