
const {ipcMain} = require("electron")

const registerOverviewHandlers = () =>{

    ipcMain.handle("overview-api:get-sales-from-last-30-days",()=>{
        const data=[
                { date: "2023-01-01", sales: 5 },
        { date: "2023-01-03", sales: 12 },
        { date: "2023-01-05", sales: 16 },
        { date: "2025-09-01", sales: 100 },
        { date: "2025-08-28", sales: 20 },
        ]
        return {ok:true,result:data}

    })

    ipcMain.handle("overview-api:get-kpis-data", () =>{


        const KPIS_data = [
            {label: "Items Total", value: "1,250"},
            {label: "Listed", value: "320"},
            {label: "Sold (30d)", value: "94"},
            {label: "Errors", value:"7"}
        ]

        return {ok:true, result:KPIS_data}

    })

    ipcMain.handle("overview-api:get-listing-status",() =>{

        const data = {active:44}

        return {ok:true,result:data}

    })


}


module.exports = {registerOverviewHandlers}