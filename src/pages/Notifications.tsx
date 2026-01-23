import React, { useState } from 'react'
import { Bell, Save, MessageSquare, ShieldAlert, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface NotificationsProps {
    user: any
    updateUser: (newUser: any) => void
}

const Notifications: React.FC<NotificationsProps> = ({ user, updateUser }) => {
    const [preferences, setPreferences] = useState({
        discordWebhook: user?.preferences?.discordWebhook || '',
        telegramBotToken: user?.preferences?.telegramBotToken || '',
        telegramChatId: user?.preferences?.telegramChatId || '',
        notifyAttack: user?.preferences?.notifyAttack || false,
        notifyCaptcha: user?.preferences?.notifyCaptcha || false
    })

    const handleSave = async () => {
        if (!user?.uuid) return
        const toastId = toast.loading('Salvando configurações...')
        try {
            const result = await (window as any).ipcRenderer.invoke('user:update-preferences', {
                uuid: user.uuid,
                preferences: { ...user.preferences, ...preferences }
            })
            if (result.success) {
                updateUser(result.user)
                toast.success('Configurações salvas com sucesso!', { id: toastId })
            } else {
                toast.error('Erro ao salvar: ' + (result.error || 'Desconhecido'), { id: toastId })
            }
        } catch (err) {
            toast.error('Erro de comunicação.', { id: toastId })
        }
    }

    const togglePref = (key: string) => {
        setPreferences(prev => ({ ...prev, [key]: !(prev as any)[key] }))
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto px-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-widest uppercase mb-2">
                        NOTIFICAÇÕES
                    </h1>
                    <p className="text-zinc-500 text-sm font-bold tracking-tight">
                        Receba alertas em tempo real sobre ataques e captchas.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className="btn-save px-8 py-4 uppercase tracking-widest text-xs"
                >
                    <Save className="w-5 h-5" />
                    Salvar Configurações
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Discord Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8 space-y-8 relative overflow-hidden group hover:border-[#5865F2]/30 transition-all duration-500"
                >
                    <div className="absolute top-0 right-0 p-32 bg-[#5865F2]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-[#5865F2]/10 transition-colors duration-500" />

                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-[#5865F2]/10 flex items-center justify-center border border-[#5865F2]/20 shadow-[0_0_30px_rgba(88,101,242,0.15)] group-hover:scale-105 transition-transform duration-500">
                            <svg className="w-8 h-8 fill-[#5865F2]" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <path d="M85.22,24.958c-11.459-8.575-22.438-8.334-22.438-8.334l-1.122,1.282     c13.623,4.087,19.954,10.097,19.954,10.097c-19.491-10.731-44.317-10.654-64.59,0c0,0,6.571-6.331,20.996-10.418l-0.801-0.962     c0,0-10.899-0.24-22.438,8.334c0,0-11.54,20.755-11.54,46.319c0,0,6.732,11.54,24.442,12.101c0,0,2.965-3.526,5.369-6.571     c-10.177-3.045-14.024-9.376-14.024-9.376c6.394,4.001,12.859,6.505,20.916,8.094c13.108,2.698,29.413-0.076,41.591-8.094     c0,0-4.007,6.491-14.505,9.456c2.404,2.965,5.289,6.411,5.289,6.411c17.71-0.561,24.441-12.101,24.441-12.02     C96.759,45.713,85.22,24.958,85.22,24.958z M35.055,63.824c-4.488,0-8.174-3.927-8.174-8.815     c0.328-11.707,16.102-11.671,16.348,0C43.229,59.897,39.622,63.824,35.055,63.824z M64.304,63.824     c-4.488,0-8.174-3.927-8.174-8.815c0.36-11.684,15.937-11.689,16.348,0C72.478,59.897,68.872,63.824,64.304,63.824z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-widest">DISCORD</h3>
                            <p className="text-zinc-500 font-bold text-xs uppercase tracking-wide">Integração via Webhook</p>
                        </div>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Webhook URL</label>
                            <div className="relative group/input">
                                <div className="absolute inset-0 bg-[#5865F2]/20 rounded-2xl blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500" />
                                <MessageSquare className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within/input:text-[#5865F2] transition-colors" />
                                <input
                                    type="text"
                                    value={preferences.discordWebhook}
                                    onChange={(e) => setPreferences({ ...preferences, discordWebhook: e.target.value })}
                                    className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-[#5865F2]/50 text-zinc-300 text-xs font-mono font-medium transition-all placeholder:text-zinc-800 relative z-10"
                                    placeholder="https://discord.com/api/webhooks/..."
                                />
                            </div>
                        </div>
                        <p className="text-[10px] text-zinc-600 font-bold px-1 leading-relaxed italic border-l-2 border-[#5865F2]/30 pl-3">
                            Crie um Webhook no seu servidor do Discord para receber notificações instantâneas de ataques e eventos.
                        </p>
                    </div>
                </motion.div>

                {/* Telegram Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8 space-y-8 relative overflow-hidden group hover:border-[#0088cc]/30 transition-all duration-500"
                >
                    <div className="absolute top-0 right-0 p-32 bg-[#0088cc]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-[#0088cc]/10 transition-colors duration-500" />

                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-[#0088cc]/10 flex items-center justify-center border border-[#0088cc]/20 shadow-[0_0_30px_rgba(0,136,204,0.15)] group-hover:scale-105 transition-transform duration-500">
                            <svg className="w-8 h-8 fill-[#0088cc]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.944 0C5.346 0 0 5.347 0 11.947c0 6.6 5.347 11.947 11.944 11.947 6.605 0 11.948-5.347 11.948-11.947C23.892 5.347 18.549 0 11.944 0zm5.495 8.181l-1.884 8.875c-.143.633-.518.788-1.05.49l-2.87-2.115-1.385 1.332c-.153.153-.282.282-.577.282l.206-2.924 5.322-4.807c.231-.206-.051-.32-.36-.112L8.514 13.06l-2.835-.886c-.617-.189-.628-.617.13-.914l11.077-4.269c.513-.189.96.12.852.89z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-widest">TELEGRAM</h3>
                            <p className="text-zinc-500 font-bold text-xs uppercase tracking-wide">Integração via Bot</p>
                        </div>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Bot Token</label>
                            <div className="relative group/input">
                                <input
                                    type="text"
                                    value={preferences.telegramBotToken}
                                    onChange={(e) => setPreferences({ ...preferences, telegramBotToken: e.target.value })}
                                    className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl py-5 px-6 outline-none focus:border-[#0088cc]/50 text-zinc-300 text-xs font-mono font-medium transition-all placeholder:text-zinc-800"
                                    placeholder="123456789:ABCDE..."
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Chat ID</label>
                            <div className="relative group/input">
                                <input
                                    type="text"
                                    value={preferences.telegramChatId}
                                    onChange={(e) => setPreferences({ ...preferences, telegramChatId: e.target.value })}
                                    className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl py-5 px-6 outline-none focus:border-[#0088cc]/50 text-zinc-300 text-xs font-mono font-medium transition-all placeholder:text-zinc-800"
                                    placeholder="Ex: 987654321"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Alertas Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-2 space-y-8"
                >
                    <div className="flex items-center gap-3">
                        <Zap className="w-6 h-6 text-amber-500 fill-amber-500/20" />
                        <h3 className="text-2xl font-black text-white uppercase tracking-widest">GATILHOS DE ALERTA</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Notify Attack */}
                        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:bg-zinc-800/40 transition-all">
                            <div className="flex items-center gap-5">
                                <div className={`p-3 rounded-xl transition-all ${preferences.notifyAttack ? 'bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-white/5 text-zinc-700'}`}>
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Notificar Ataques</h4>
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">Alerta imediato quando sofrer ataques</p>
                                </div>
                            </div>
                            <button
                                onClick={() => togglePref('notifyAttack')}
                                className={`w-14 h-7 rounded-full relative transition-all duration-300 ${preferences.notifyAttack ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-black/50 border border-white/5'}`}
                            >
                                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300 ${preferences.notifyAttack ? 'left-[32px]' : 'left-1'}`} />
                            </button>
                        </div>

                        {/* Notify Captcha */}
                        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:bg-zinc-800/40 transition-all">
                            <div className="flex items-center gap-5">
                                <div className={`p-3 rounded-xl transition-all ${preferences.notifyCaptcha ? 'bg-indigo-500/20 text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-white/5 text-zinc-700'}`}>
                                    <Bell className="w-6 h-6" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Notificar Captcha</h4>
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">Alerta para resolução manual de captcha</p>
                                </div>
                            </div>
                            <button
                                onClick={() => togglePref('notifyCaptcha')}
                                className={`w-14 h-7 rounded-full relative transition-all duration-300 ${preferences.notifyCaptcha ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-black/50 border border-white/5'}`}
                            >
                                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300 ${preferences.notifyCaptcha ? 'left-[32px]' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Notifications
