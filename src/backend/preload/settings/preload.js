
const expose = ({contextBridge, ipcRenderer}) =>{

    contextBridge.exposeInMainWorld("settings",{
        "api_get_hypeboost_credentials":() => getHypeBoostCredentials(ipcRenderer),
        "api_set_hypeboost_credentials":(form) => setHypeBoostCredentials(ipcRenderer,form),
        "api_get_currency_settings":()=>getCurrencySettings(ipcRenderer)

    })

}

const getHypeBoostCredentials = (ipcRenderer) =>{

    return ipcRenderer.invoke("settings_api:get_hypeboost_credentials")

}
const setHypeBoostCredentials = (ipcRenderer, form) =>{
    return ipcRenderer.invoke("settings_api:set_hypeboost_credentials",form)
}

const getCurrencySettings = (ipcRenderer) =>{
    return ipcRenderer.invoke("settings_api:get_currency_settings");
}

module.exports = {expose}