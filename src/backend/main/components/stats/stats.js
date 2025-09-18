const {ipcMain} = require("electron")
const items = require("../items/items-db");



const registerStatsHandlers = () =>{

    ipcMain.handle("stats_api:get_sales",()=>{
        return items.get_sales()
    })

    ipcMain.handle("stats_api:get_purchases",()=>{
        return items.get_purchases()

    })
    ipcMain.handle("stats_api:get_kpis_data",()=>{
        return items.get_kpis_sales()
    })

    ipcMain.handle("stats_api:get_listings_amount", ()=>{
        const resp =  items.get_listings_amount();

        const results = {
            "active":0,
            "sold":0,
            "toship":0
        }

        resp.map(l =>{
            results[l['label']] = l['count']
        })



        return {ok:true, results:results};
    })

}


module.exports = {registerStatsHandlers}