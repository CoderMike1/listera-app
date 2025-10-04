


const expose = ({contextBridge,ipcRenderer}) =>{

    contextBridge.exposeInMainWorld('notify',{

        "add":(payload) => ipcRenderer.invoke("notifications_api:add",payload),
        "list":(opts) => ipcRenderer.invoke("notifications_api:list",opts),
        "markRead":(id) => ipcRenderer.invoke("notifications_api:markRead",id),
        "clear":() => ipcRenderer.invoke("notifications_api:clear"),
        "onNew": (cb) =>{
            const handler = (_e, notif) => cb(notif);
            ipcRenderer.on("notifications_api:new", handler);
            return () => ipcRenderer.off("notifications_api:new", handler)
        }

    })

}

module.exports = {expose}