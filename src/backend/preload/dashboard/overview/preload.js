

const expose = ({contextBridge,ipcRenderer}) =>{

    contextBridge.exposeInMainWorld("overview",{

        "api_get_sales_from_last_30_days":() =>getSalesFrom30Days(ipcRenderer),
        "api_get_kpis_data":() =>getKPISData(ipcRenderer),
        "api_get_listing_status": () =>getListingStatus(ipcRenderer)
    })


}

const getSalesFrom30Days = (ipcRenderer) =>{

    const resp = ipcRenderer.invoke("overview-api:get-sales-from-last-30-days")
    return resp;

}
const getKPISData = (ipcRenderer) =>{
    const resp = ipcRenderer.invoke("overview-api:get-kpis-data")
    return resp;
}
const getListingStatus = (ipcRenderer) =>{
    const resp = ipcRenderer.invoke("overview-api:get-listing-status")
    return resp;
}
module.exports = {expose}