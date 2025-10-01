
const expose = ({contextBridge, ipcRenderer}) =>{

    contextBridge.exposeInMainWorld("settings",{
        "api_get_hypeboost_credentials":() => getHypeBoostCredentials(ipcRenderer)

    })

}

const getHypeBoostCredentials = (ipcRenderer) =>{

    return ipcRenderer.invoke("settings_api:get_hypeboost_credentials")

}