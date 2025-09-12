const {ipcMain} = require("electron")

const items = require('./items-db')

const registerItemsHandlers = () =>{

    ipcMain.handle("items_api:get_kpis_data",() =>{
       return  items.getKpis()
    })

    ipcMain.handle("items_api:get_all_items",() =>{

        return items.getAll()

    })

    ipcMain.handle("items_api:update_item",(_e,item)=>{
        const id = Number(item?.id);
        if(!id) return { ok: false, error: "id is required" };
        return items.update(item)
    })

    ipcMain.handle("items_api:add_item",(_e,item) =>{
        return items.add(item)

    })

    ipcMain.handle("items_api:delete_item",(_e,item_id) =>{
        return items.remove(item_id)
    })

}


module.exports = {registerItemsHandlers}