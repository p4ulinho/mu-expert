import React from 'react'

interface TitleBarProps {
    title?: string
}

const TitleBar: React.FC<TitleBarProps> = ({ title = "Multi Contas Expert PS" }) => {
    const handleMinimize = () => (window as any).ipcRenderer.minimize()
    const handleMaximize = () => (window as any).ipcRenderer.maximize()
    const handleClose = () => (window as any).ipcRenderer.close()

    return (
        <div className="h-9 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 select-none drag border-b border-white/5 relative z-[60]" style={{ WebkitAppRegion: 'drag' } as any}>
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(217,70,239,0.8)]"></div>
                <span className="text-[10px] font-black tracking-[0.2em] text-accent uppercase drop-shadow-sm">{title}</span>
            </div>

            <div className="flex no-drag" style={{ WebkitAppRegion: 'no-drag' } as any}>
                <button
                    onClick={handleMinimize}
                    className="w-11 h-9 flex items-center justify-center hover:bg-white/5 transition-colors group"
                >
                    <div className="w-3 h-[1px] bg-textMuted group-hover:bg-white transition-colors shadow-[0_0_5px_currentColor]"></div>
                </button>
                <button
                    onClick={handleMaximize}
                    className="w-11 h-9 flex items-center justify-center hover:bg-white/5 transition-colors group"
                >
                    <div className="w-3 h-3 border border-textMuted group-hover:border-white transition-colors shadow-[0_0_5px_currentColor]"></div>
                </button>
                <button
                    onClick={handleClose}
                    className="w-11 h-9 flex items-center justify-center hover:bg-red-500/80 hover:text-white transition-colors text-textMuted"
                >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default TitleBar
