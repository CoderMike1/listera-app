
const expose = ({contextBridge,ipcRenderer}) =>{

    contextBridge.exposeInMainWorld("stats",{

        "api_get_sales" :()=> getSales(ipcRenderer),
        "api_get_purchases":()=>getPurchases(ipcRenderer),
        "api_get_kpis_data":()=>getKpisData(ipcRenderer)

    })

}

const getSales = (ipcRenderer) =>{

    const resp = ipcRenderer.invoke("stats_api:get_sales")
    return resp;

}
const getPurchases = (ipcRenderer) =>{
    const resp = ipcRenderer.invoke("stats_api:get_purchases")
    return resp;
}
const getKpisData = (ipcRenderer) =>{
    const resp = ipcRenderer.invoke("stats_api:get_kpis_data")
    return resp;
}


module.exports = {expose}