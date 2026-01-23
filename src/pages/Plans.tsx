import React from 'react'
import { Sparkles } from 'lucide-react'

interface PlansProps {
    user?: any
}

const Plans: React.FC<PlansProps> = () => {
    return (
        <div className="h-full flex items-center justify-center animate-in fade-in duration-700">
            <div className="relative group">
                {/* Decorative background glow */}
                <div className="absolute -inset-20 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-1000" />

                <div className="relative bg-[#111111]/40 backdrop-blur-3xl border border-white/5 p-20 rounded-[40px] shadow-2xl flex flex-col items-center gap-8 max-w-2xl text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                        <Sparkles className="w-10 h-10 text-emerald-400 animate-pulse" />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-6xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 uppercase">
                                PREÇOS
                            </span>
                        </h2>

                        <div className="h-1 w-20 bg-emerald-500/20 mx-auto rounded-full overflow-hidden">
                            <div className="h-full w-full bg-emerald-500 animate-[shimmer_2s_infinite] origin-left" />
                        </div>
                    </div>

                    <p className="text-zinc-400 font-medium tracking-wide uppercase text-xs opacity-60">
                        Estamos em fase de testes para definição de valores.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Plans
