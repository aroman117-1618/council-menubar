const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('council', {
  invoke: (channel, payload, base) => ipcRenderer.invoke(channel, payload, base)
});
