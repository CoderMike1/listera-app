const {ipcMain} = require("electron")

const items = require('./items-db')

let items_data = [
    {id:1,image:"jordan",name:"Air Jordan 1 White", sku:"ABC-SKD",size:"43 1/3",stock:1,purchase_price:"405.10"},
    {id:2,image:"dunk",name:"Nike Dunk Low Grey Multim Krus dsa928", sku:"383924980",size:"39.5", stock:3, purchase_price:"399.99"}
]
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

        return items.upsert(item.id)
    })

    ipcMain.handle("items_api:add_item",(_e,item) =>{
        return items.add(item)

    })

}


module.exports = {registerItemsHandlers}