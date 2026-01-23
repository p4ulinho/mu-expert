const { contextBridge, ipcRenderer } = require('electron')

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
    on(channel: string, listener: (event: any, ...args: any[]) => void) {
        ipcRenderer.on(channel, (event: any, ...args: any[]) => listener(event, ...args))
    },
    off(channel: string, ...args: any[]) {
        ipcRenderer.off(channel, ...args)
    },
    send(...args: any[]) {
        const [channel, ...omit] = args
        ipcRenderer.send(channel, ...omit)
    },
    invoke(...args: any[]) {
        const [channel, ...omit] = args
        return ipcRenderer.invoke(channel, ...omit)
    },

    // Custom window controls
    minimize: () => ipcRenderer.send('window-controls', 'minimize'),
    maximize: () => ipcRenderer.send('window-controls', 'maximize'),
    close: () => ipcRenderer.send('window-controls', 'close'),
})
