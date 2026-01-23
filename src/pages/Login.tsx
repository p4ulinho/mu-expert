import React, { useState, useEffect } from 'react'
import { Mail, Lock, User, Phone, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoginProps {
    onLogin: (user: any, rememberMe: boolean) => void
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(true)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: ''
    })

    useEffect(() => {
        const lastEmail = localStorage.getItem('last_email')
        if (lastEmail && !isRegistering) {
            setFormData(prev => ({ ...prev, email: lastEmail }))
        }
    }, [isRegistering])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        try {
            if (isRegistering) {
                const result = await (window as any).ipcRenderer.invoke('auth:register', formData)
                if (result.success) {
                    setMessage({ type: 'success', text: 'Conta criada com sucesso!' })
                    setTimeout(() => {
                        onLogin(result.user, true)
                    }, 1500)
                } else {
                    setMessage({ type: 'error', text: result.error || 'Erro ao criar conta' })
                }
            } else {
                const result = await (window as any).ipcRenderer.invoke('auth:login', {
                    email: formData.email,
                    password: formData.password
                })
                if (result.success) {
                    if (rememberMe) {
                        localStorage.setItem('last_email', formData.email)
                    } else {
                        localStorage.removeItem('last_email')
                    }
                    onLogin(result.user, rememberMe)
                } else {
                    setMessage({ type: 'error', text: result.error || 'E-mail ou senha incorretos' })
                }
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Erro de conexão. Tente novamente.' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex-1 flex items-center justify-center p-6 bg-[#0c0c0e] relative overflow-hidden font-sans">
            {/* Very subtle background light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/[0.04] blur-[120px] rounded-full pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[400px] bg-[#141417] p-10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/[0.03] relative z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-11 h-11 bg-indigo-600 rounded-2xl mb-5 flex items-center justify-center shadow-[0_8px_16px_rgba(79,70,229,0.15)] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-indigo-700"></div>
                        <div className="w-4 h-4 bg-white rounded-md relative z-10"></div>
                    </div>
                    <h1 className="text-xl font-semibold text-zinc-100 tracking-tight select-none">MULTI<span className="text-zinc-500 font-normal ml-0.5">EXPERT</span></h1>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-500/80 font-medium mt-2 select-none">Control Center</p>
                </div>

                <AnimatePresence mode="wait">
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-xs border ${message.type === 'success'
                                ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400/90'
                                : 'bg-rose-500/5 border-rose-500/10 text-rose-400/90'
                                }`}
                        >
                            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                            <span className="font-medium">{message.text}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegistering && (
                        <>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Nome Completo"
                                    required
                                    className="w-full bg-[#0c0c0e] border border-white/[0.04] rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/20 transition-all text-sm text-zinc-200 placeholder:text-zinc-600 font-medium"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Telefone / WhatsApp"
                                    required
                                    className="w-full bg-[#0c0c0e] border border-white/[0.04] rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/20 transition-all text-sm text-zinc-200 placeholder:text-zinc-600 font-medium"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
                        <input
                            type="email"
                            placeholder="Endereço de E-mail"
                            required
                            className="w-full bg-[#0c0c0e] border border-white/[0.04] rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/20 transition-all text-sm text-zinc-200 placeholder:text-zinc-600 font-medium"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
                        <input
                            type="password"
                            placeholder="Senha"
                            required
                            className="w-full bg-[#0c0c0e] border border-white/[0.04] rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/20 transition-all text-sm text-zinc-200 placeholder:text-zinc-600 font-medium"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {!isRegistering && (
                        <div className="flex items-center gap-2 px-1 pt-1">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-white/10 bg-[#0c0c0e] focus:ring-indigo-500/30 cursor-pointer accent-indigo-600"
                            />
                            <label htmlFor="remember" className="text-[11px] text-zinc-500 font-medium cursor-pointer select-none hover:text-zinc-400 transition-colors">
                                Manter-me conectado
                            </label>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-zinc-100 hover:bg-white disabled:opacity-50 text-[#0c0c0e] font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group mt-6 text-[11px] uppercase tracking-wider cursor-pointer shadow-lg shadow-white/5 active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                {isRegistering ? 'CRIAR CONTA' : 'LOGAR NO SISTEMA'}
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsRegistering(!isRegistering)
                            setMessage(null)
                        }}
                        className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors font-semibold uppercase tracking-widest cursor-pointer"
                    >
                        {isRegistering ? 'JÁ POSSUI UMA CONTA? ENTRAR' : 'AINDA NÃO TEM CONTA? CADASTRE-SE'}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default Login
