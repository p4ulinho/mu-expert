const { contextBridge: c, ipcRenderer: o } = require("electron");
c.exposeInMainWorld("ipcRenderer", {
  on(n, e) {
    o.on(n, (i, ...s) => e(i, ...s));
  },
  off(n, ...e) {
    o.off(n, ...e);
  },
  send(...n) {
    const [e, ...i] = n;
    o.send(e, ...i);
  },
  invoke(...n) {
    const [e, ...i] = n;
    return o.invoke(e, ...i);
  },
  // Custom window controls
  minimize: () => o.send("window-controls", "minimize"),
  maximize: () => o.send("window-controls", "maximize"),
  close: () => o.send("window-controls", "close")
});
