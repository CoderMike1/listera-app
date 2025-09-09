


const expose = ({contextBridge,ipcRenderer}) =>{

    contextBridge.exposeInMainWorld("notifications",{

        "api_get_all_notifications":() =>getAllNotifications(ipcRenderer)

    })


}

const getAllNotifications = (ipcRenderer) =>{

    const resp = ipcRenderer.invoke("notifications-api:get-all-notifications")

    return resp;

}

module.exports = {expose}