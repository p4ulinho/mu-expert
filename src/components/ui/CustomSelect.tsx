import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, Check, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CustomSelectOption {
    label: string
    value: string | number
    color?: string
}

interface CustomSelectProps {
    label?: string
    icon?: any
    value: string | number
    onChange: (value: any) => void
    options: CustomSelectOption[]
    placeholder?: string
    loading?: boolean
    borderColor?: string
    color?: string
    renderOption?: (option: CustomSelectOption) => React.ReactNode
}

// Global state to track which select is currently open
// This ensures that only one CustomSelect can be open at a time application-wide
let activeSelectId: string | null = null;
const listeners = new Set<(id: string | null) => void>();

const notifyListeners = (newId: string | null) => {
    activeSelectId = newId;
    listeners.forEach(listener => listener(newId));
};

export const CustomSelect: React.FC<CustomSelectProps> = ({
    label,
    icon: Icon,
    value,
    onChange,
    options,
    placeholder = "Selecione...",
    loading = false,
    borderColor = "hover:border-amber-500/30",
    color = "text-amber-500",
    renderOption
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const id = useRef(Math.random().toString(36).substr(2, 9)).current
    const selectedOption = options.find((o) => o.value === value)

    // Handle outside clicks
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                if (activeSelectId === id) {
                    notifyListeners(null)
                }
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    // Subscribe to global active state changes
    useEffect(() => {
        const handleActiveChange = (activeId: string | null) => {
            if (activeId !== id && isOpen) {
                setIsOpen(false);
            }
        };

        listeners.add(handleActiveChange);
        return () => {
            listeners.delete(handleActiveChange);
        };
    }, [id, isOpen]);

    const toggleOpen = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event bubbling
        if (loading) return;

        if (!isOpen) {
            setIsOpen(true);
            notifyListeners(id);
        } else {
            setIsOpen(false);
            notifyListeners(null);
        }
    }

    return (
        <div className={`relative ${isOpen ? 'z-[100]' : 'z-20'}`} ref={containerRef}>
            {label && (
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-zinc-500 mb-2">
                    {Icon && <Icon className="w-3.5 h-3.5" />} {label}
                </label>
            )}

            <button
                type="button"
                onClick={toggleOpen}
                disabled={loading}
                className={`w-full bg-[#121214] border border-white/10 rounded-xl py-3 px-4 outline-none ${loading ? '' : borderColor} text-white text-sm font-semibold flex items-center justify-between transition-all group hover:bg-black/60 relative cursor-pointer`}
            >
                {loading ? (
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Loader2 className="w-4 h-4 animate-spin" /> Carregando...
                    </div>
                ) : (
                    <>
                        <div className={!selectedOption ? 'text-zinc-500' : 'text-zinc-200'}>
                            {selectedOption ? (
                                renderOption ? renderOption(selectedOption) : selectedOption.label
                            ) : placeholder}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[250px] overflow-y-auto custom-scrollbar ring-1 ring-black/50"
                    >
                        <div className="p-1 space-y-0.5">
                            <button
                                type="button"
                                onClick={() => { onChange(""); setIsOpen(false); notifyListeners(null); }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${!value ? 'bg-white/5 text-zinc-200' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
                            >
                                <span className="text-sm font-medium">{placeholder}</span>
                                {!value && <Check className={`w-3.5 h-3.5 ${color}`} />}
                            </button>

                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => { onChange(opt.value); setIsOpen(false); notifyListeners(null); }}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${value === opt.value ? 'bg-white/5 text-zinc-200' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
                                >
                                    <div className="text-sm font-medium truncat pr-2 flex-1">
                                        {renderOption ? renderOption(opt) : opt.label}
                                    </div>
                                    {value === opt.value && <Check className={`w-3.5 h-3.5 ${color}`} />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
