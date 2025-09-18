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

    ipcMain.handle("items_api:sold_item",(_e,item)=>{
        if(item.sold_stock < item.form_data.stock)
        {
            //zmniejszamy active stock
            items.reduce_stock(item)
            //name, sku, size,status, stock, purchase_price,created_at
            //dodajemy nowy rekord

            if(item.shipped){
                //dodajemy nowy rekord  jako sold
                const payload = {
                    name:item.form_data.name,
                    sku:item.form_data.sku,
                    size:item.form_data.size,
                    status:"sold",
                    stock:item.sold_stock,
                    purchase_price:item.form_data.purchase_price,
                    created_at:item.form_data.created_at,
                    selling_price:item.selling_price,
                    sale_at:item.sale_at,
                    purchased_at:item.purchased_at
                }

                return items.add_sold(payload)

            }
            else{
                //dodajemy nowy rekord jako toship
                const payload = {
                    name:item.form_data.name,
                    sku:item.form_data.sku,
                    size:item.form_data.size,
                    status:"toship",
                    stock:item.sold_stock,
                    purchase_price:item.form_data.purchase_price,
                    created_at:item.form_data.created_at,
                    selling_price:item.selling_price,
                    sale_at:item.sale_at,
                    purchased_at:item.purchased_at
                }

                return items.add_sold(payload)
            }


        }
        else{
            //wszystko jak leci
            if(item.shipped){
                //dajemy na sold
                return items.sold_item(item)
            }
            else{
                //dajemy na toship
                return items.toship_item(item)
            }
        }


    })

    ipcMain.handle("items_api:mark_item_as_shipped",(_e,item_id)=>{

        return items.mark_as_shipped(item_id)

    })


}


module.exports = {registerItemsHandlers}