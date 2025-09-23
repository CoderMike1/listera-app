

const expose =({contextBridge,ipcRenderer}) =>{

    contextBridge.exposeInMainWorld("marketplace",{
        "api_get_tasks":()=>getTasks(ipcRenderer)
    })

}


const getTasks = (ipcRenderer) =>{

    return ipcRenderer.invoke("marketplace_api:get_tasks");

}



module.exports = {expose}