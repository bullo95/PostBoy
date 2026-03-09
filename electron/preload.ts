import { contextBridge } from 'electron'

// Exposer uniquement les APIs nécessaires de manière sécurisée
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
})

// Note: Pour l'instant, Postboy n'a pas besoin d'accès au système de fichiers
// car tout est stocké dans localStorage. Si nécessaire plus tard, ajouter
// des APIs sécurisées via IPC (ipcRenderer.invoke)
