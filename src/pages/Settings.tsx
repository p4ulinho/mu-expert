import React, { useState, useEffect } from 'react'
import { User, Download, RefreshCw, CheckCircle } from 'lucide-react'

interface SettingsProps {
    user: any
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
    const [appVersion, setAppVersion] = useState<string>('0.0.0')
    const [updateStatus, setUpdateStatus] = useState<string>('')
    const [updateResult, setUpdateResult] = useState<any>(null)
    const [isChecking, setIsChecking] = useState(false)
    const [downloadProgress, setDownloadProgress] = useState<any>(null)

    useEffect(() => {
        // Get initial version
        const getVersion = async () => {
            const version = await (window as any).ipcRenderer.invoke('app:get-version')
            setAppVersion(version)
        }
        getVersion()

        // Listen for updater events
        const listener = (_: any, data: any) => {
            console.log('Updater Event:', data)
            switch (data.type) {
                case 'checking':
                    setUpdateStatus('checking')
                    setIsChecking(true)
                    break
                case 'available':
                    setUpdateStatus('available')
                    setIsChecking(false)
                    setUpdateResult(data.info)
                    break
                case 'not-available':
                    setUpdateStatus('not-available')
                    setIsChecking(false)
                    break
                case 'progress':
                    setUpdateStatus('downloading')
                    setDownloadProgress(data.info)
                    break
                case 'downloaded':
                    setUpdateStatus('ready')
                    setIsChecking(false)
                    break
                case 'error':
                    setUpdateStatus('error')
                    setIsChecking(false)
                    setUpdateResult(data.error)
                    break
            }
        }

        (window as any).ipcRenderer.on('updater:event', listener)

        return () => {
            (window as any).ipcRenderer.off('updater:event', listener)
        }
    }, [])

    const checkForUpdates = async () => {
        setIsChecking(true)
        setUpdateStatus('checking')
        await (window as any).ipcRenderer.invoke('updater:check')
    }

    const downloadUpdate = async () => {
        await (window as any).ipcRenderer.invoke('updater:download')
    }

    const installUpdate = async () => {
        await (window as any).ipcRenderer.invoke('updater:install')
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
            <div>
                <h1 className="text-4xl font-black italic tracking-tighter mb-2">CONFIGURAÇÕES</h1>
                <p className="text-textMuted">Personalize sua experiência e verifique atualizações.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Update Section */}
                <div className="glass p-8 rounded-3xl border border-white/5 space-y-6 md:col-span-2 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <RefreshCw className={`w-6 h-6 text-indigo-400 ${isChecking ? 'animate-spin' : ''}`} />
                        Atualizações de Software
                    </h3>

                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-200">Versão Atual: <span className="text-indigo-400 font-mono text-lg">{appVersion}</span></p>
                            <p className="text-[10px] text-textMuted mt-1">
                                {updateStatus === 'checking' && 'Verificando atualizações...'}
                                {updateStatus === 'available' && 'Nova atualização disponível!'}
                                {updateStatus === 'not-available' && 'Você já está na versão mais recente.'}
                                {updateStatus === 'downloading' && 'Baixando atualização...'}
                                {updateStatus === 'ready' && 'Atualização pronta para instalar.'}
                                {updateStatus === 'error' && 'Erro ao verificar atualizações.'}
                                {!updateStatus && 'Clique para verificar se há novidades.'}
                            </p>

                            {updateStatus === 'error' && updateResult && (
                                <p className="text-[10px] text-red-400 mt-2 font-mono bg-red-500/10 p-2 rounded">{updateResult}</p>
                            )}

                            {updateStatus === 'downloading' && downloadProgress && (
                                <div className="mt-2 w-full max-w-xs space-y-1">
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${downloadProgress.percent}%` }}></div>
                                    </div>
                                    <p className="text-[10px] text-textMuted text-right">{Math.round(downloadProgress.percent)}%</p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {updateStatus === 'available' ? (
                                <button
                                    onClick={downloadUpdate}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                                >
                                    <Download className="w-5 h-5" />
                                    Baixar Atualização
                                </button>
                            ) : updateStatus === 'ready' ? (
                                <button
                                    onClick={installUpdate}
                                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 animate-pulse"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Instalar e Reiniciar
                                </button>
                            ) : (
                                <button
                                    onClick={checkForUpdates}
                                    disabled={isChecking}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <RefreshCw className={`w-5 h-5 ${isChecking ? 'animate-spin' : ''}`} />
                                    {isChecking ? 'Verificando...' : 'Verificar Agora'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <User className="w-6 h-6 text-primary" /> Perfil de Usuário
                    </h3>

                    <div className="flex flex-col items-center mb-6">
                        <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-800 to-black p-[2px] shadow-2xl shadow-emerald-500/10 group-hover:from-emerald-500 group-hover:to-emerald-900 transition-all duration-500">
                                <div className="w-full h-full rounded-[14px] bg-[#121214] flex items-center justify-center overflow-hidden relative">
                                    {user?.avatar ? (
                                        <img src={user.avatar} className="w-full h-full object-cover group-hover:opacity-50 transition-all duration-300" alt="Profile" />
                                    ) : (
                                        <User className="w-10 h-10 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">Alterar</span>
                                    </div>
                                </div>
                            </div>
                            <input
                                type="file"
                                id="avatar-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = async () => {
                                            const base64 = reader.result as string;
                                            try {
                                                const result = await (window as any).ipcRenderer.invoke('user:update-profile', {
                                                    uuid: user.uuid,
                                                    avatar: base64,
                                                    fullName: user.fullName // Keep existing name
                                                });
                                                if (result && result.success) {
                                                    // Ideally update the local user state here, assuming App.tsx will refresh or we can trigger it
                                                    // For now, we rely on the fact that Navbar uses user prop. 
                                                    // We might need to call a prop function to update user in App.tsx
                                                    window.location.reload(); // Simple reload to fetch fresh user data or we need a setUser prop
                                                }
                                            } catch (err) {
                                                console.error("Failed to update avatar", err);
                                            }
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </div>
                        <p className="text-[10px] text-textMuted mt-3 font-medium">Clique na imagem para alterar</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-textMuted ml-1">Nome de Exibição</label>
                            <input type="text" readOnly value={user?.fullName || "Usuário"} className="w-full bg-secondary/50 border border-white/5 rounded-xl py-3.5 px-4 outline-none focus:border-primary/50 opacity-80" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-textMuted ml-1">E-mail da Conta</label>
                            <input type="email" readOnly value={user?.email || "contato@exemplo.com"} className="w-full bg-secondary/50 border border-white/5 rounded-xl py-3.5 px-4 outline-none focus:border-primary/50 opacity-80" />
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Settings
