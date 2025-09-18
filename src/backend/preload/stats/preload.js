
const expose = ({contextBridge,ipcRenderer}) =>{

    contextBridge.exposeInMainWorld("stats",{

        "api_get_sales" :()=> getSales(ipcRenderer),
        "api_get_purchases":()=>getPurchases(ipcRenderer),
        "api_get_kpis_data":()=>getKpisData(ipcRenderer),
        "api_get_listings_amount":()=>getListingsAmount(ipcRenderer)

    })

}

const getSales = (ipcRenderer) =>{

    return  ipcRenderer.invoke("stats_api:get_sales")

}
const getPurchases = (ipcRenderer) =>{
    return  ipcRenderer.invoke("stats_api:get_purchases")
}
const getKpisData = (ipcRenderer) =>{
    return  ipcRenderer.invoke("stats_api:get_kpis_data")
}
const getListingsAmount = (ipcRenderer) =>{
    return ipcRenderer.invoke("stats_api:get_listings_amount")
}
module.exports = {expose}