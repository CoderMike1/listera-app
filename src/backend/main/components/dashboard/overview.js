
const {ipcMain} = require("electron")
const items = require("../items/items-db");
const {count_total_listed_items} = require("../marketplace/tasks");

const registerOverviewHandlers = () =>{



    ipcMain.handle("overview-api:get-kpis-data", () =>{


        const items_total = items.get_total_items()
        const listed_items_total = count_total_listed_items()
        const last_sales = items.get_sales_from_30_days()

        const KPIS_data = [
            {label: "Items Total", value: items_total.total_stock},
            {label: "Listed Items", value: listed_items_total},
            {label: "Sold (30d)", value: last_sales.score},
            {label: "Errors", value:"x"}
        ]

        return {ok:true, results:KPIS_data}

    })

    ipcMain.handle("overview-api:get-listing-status",() =>{

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


module.exports = {registerOverviewHandlers}