


const expose = ({contextBridge,ipcRenderer}) =>{

    contextBridge.exposeInMainWorld("items",{

        "api_get_kpis_data":() => getKPISData(ipcRenderer),
        "api_get_all_items":() =>getAllItems(ipcRenderer),
        "api_update_item":(item)=> updateRecord(ipcRenderer,item),
        "api_add_item":(item) => addRecord(ipcRenderer,item),
        "api_delete_item":(id) => deleteRecord(ipcRenderer,id),
        "api_add_sold_item":(item)=> addSoldRecord(ipcRenderer,item),
        "api_mark_item_as_shipped":(item_id) =>markRecordAsShipped(ipcRenderer,item_id)
    })



}

const getKPISData = (ipcRenderer) =>{

    return  ipcRenderer.invoke("items_api:get_kpis_data")

}

const getAllItems = (ipcRenderer) =>{
    return  ipcRenderer.invoke("items_api:get_all_items")
}
const updateRecord = (ipcRenderer,item) =>{
    return  ipcRenderer.invoke("items_api:update_item",item)
}
const addRecord = (ipcRenderer,item) =>{
    return  ipcRenderer.invoke("items_api:add_item",item)
}

const deleteRecord = (ipcRenderer, item_id) =>{
    return  ipcRenderer.invoke("items_api:delete_item",item_id)
}

const addSoldRecord = (ipcRenderer,item) =>{
    return  ipcRenderer.invoke("items_api:sold_item",item)
}
const markRecordAsShipped = (ipcRenderer,item_id)=>{
    return  ipcRenderer.invoke("items_api:mark_item_as_shipped",item_id)
}




module.exports = {expose}