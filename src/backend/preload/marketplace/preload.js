

const expose =({contextBridge,ipcRenderer}) =>{

    contextBridge.exposeInMainWorld("marketplace",{
        "api_get_tasks":()=>getTasks(ipcRenderer),
        "api_add_task":(task)=>addTask(ipcRenderer,task),
        "api_delete_task":(task_listing_id) =>deleteTask(ipcRenderer,task_listing_id),
        "api_add_listing":(form)=>addListing(ipcRenderer,form),
        "api_delete_listing":(form) => deleteListing(ipcRenderer,form)
    })

}


const getTasks = (ipcRenderer) =>{

    return ipcRenderer.invoke("marketplace_api:get_tasks");

}

const addTask = (ipcRenderer,task) =>{
    return ipcRenderer.invoke("marketplace_api:add_task",task)
}
const deleteTask = (ipcRenderer,task_listing_id) =>{
    return ipcRenderer.invoke("marketplace_api:delete_task",task_listing_id)
}

const addListing = (ipcRenderer,form) =>{
    return ipcRenderer.invoke("marketplace_api:add_listing",form)
}
const deleteListing = (ipcRenderer,form) =>{
    return ipcRenderer.invoke("marketplace_api:delete_listing",form)
}


module.exports = {expose}