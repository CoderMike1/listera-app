


const expose = ({contextBridge,ipcRenderer}) =>{

    contextBridge.exposeInMainWorld("notifications",{

        "api_get_all_notifications":() =>getAllNotifications(ipcRenderer)

    })


}

const getAllNotifications = (ipcRenderer) =>{

    return  ipcRenderer.invoke("notifications-api:get-all-notifications")

}

module.exports = {expose}