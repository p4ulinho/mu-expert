import React, { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import ConfirmationModal from '../../components/ConfirmationModal'

interface PurchaseWidgetProps {
    title: string
    subtitle: string
    icon: React.ElementType
    price: number
    stock: number
    itemName: string // e.g., "Proxies", "Contas"
    onPurchase: (quantity: number) => Promise<void>
    isBusy?: boolean
    variant?: 'default' | 'compact'
}

const PurchaseWidget: React.FC<PurchaseWidgetProps> = ({
    title,
    subtitle,
    icon: Icon,
    price,
    stock,
    itemName,
    onPurchase,
    isBusy = false,
    variant = 'default'
}) => {
    const [quantity, setQuantity] = useState(1)
    const [showConfirm, setShowConfirm] = useState(false)

    const handleBuyClick = () => {
        setShowConfirm(true)
    }

    const handleConfirm = async () => {
        await onPurchase(quantity)
        setQuantity(1)
        setShowConfirm(false)
    }

    return (
        <div className={`glass rounded-2xl border border-white/5 shadow-2xl overflow-hidden relative group ${variant === 'compact' ? 'p-5' : 'p-6'}`}>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                <ShoppingCart className="w-32 h-32 rotate-12" />
            </div>

            <div className="relative z-10 flex flex-col h-full gap-5">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-600/10 rounded-xl">
                        <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-tighter leading-none">{title}</h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.15em] mt-0.5">{subtitle}</p>
                    </div>
                </div>

                {/* Price & Stock Stats */}
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Preço Unitário</p>
                        <div className="flex items-end gap-1">
                            <span className="text-2xl font-black text-white">R$ {price.toFixed(2).replace('.', ',')}</span>
                            <span className="text-[10px] font-bold text-zinc-500 mb-1.5">/unid</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Estoque</p>
                        <span className="text-base font-bold text-emerald-500">{stock}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-zinc-300">Quantidade</label>
                        <span className="bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 px-2 py-0.5 rounded-lg font-bold text-[10px]">
                            {quantity} {itemName.toUpperCase()}
                        </span>
                    </div>

                    <input
                        type="range"
                        min="1"
                        max={stock}
                        step="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all"
                    />

                    <div className="flex justify-between text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                        <span>1</span>
                        <span>{Math.floor(stock / 2)}</span>
                        <span>{stock}</span>
                    </div>
                </div>

                {/* Total & Action */}
                <div className="mt-auto space-y-3">
                    <div className="bg-[#0f172a]/50 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                        <span className="font-bold text-zinc-400 text-xs">Total Estimado:</span>
                        <span className="text-lg font-black text-white">R$ {(quantity * price).toFixed(2).replace('.', ',')}</span>
                    </div>

                    <button
                        onClick={handleBuyClick}
                        disabled={isBusy || stock === 0}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-bold text-white text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 group"
                    >
                        <ShoppingCart className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        COMPRAR AGORA
                    </button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                title="Confirmar Compra"
                message={`Você está prestes a adquirir ${quantity} ${itemName} por R$ ${(quantity * price).toFixed(2).replace('.', ',')}. Deseja continuar?`}
                variant="success"
                confirmText="Confirmar Pagamento"
                onConfirm={handleConfirm}
            />
        </div>
    )
}

export default PurchaseWidget
