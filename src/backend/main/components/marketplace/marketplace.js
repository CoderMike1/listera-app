const {ipcMain} = require('electron')
const tasks = require("./tasks");
const {add_listing, delete_listing} = require("./sites/hypeboost/main");
const {getHypeBoostCredentials} = require("../settings");


const registerMarketplaceHandlers = () =>{

    ipcMain.handle('marketplace_api:get_tasks',()=>{
        const results = tasks.readTasks()
        return {ok:true,results:results}

    })

    ipcMain.handle("marketplace_api:add_task",(_e,task)=>{

        const results = tasks.addTask(task);
        return {ok:true,results:results}
    })

    ipcMain.handle("marketplace_api:delete_task",(_e,task_listing_id)=>{
        const results = tasks.deleteTask(task_listing_id);

        return {ok:true,results:results}
    })

    ipcMain.handle("marketplace_api:add_listing",async (_e,form)=>{
        let results;
        switch (form.site){
            case "HypeBoost":
                const {login_hypeboost,password_hypeboost} = await getHypeBoostCredentials()
                results = await add_listing(form.sku,form.size,form.payout_price,form.minimum_price,form.stock,login_hypeboost,password_hypeboost);


                break;
        }

        return {ok:true,results:results}


    })
    ipcMain.handle("marketplace_api:delete_listing",async (_e, form)=>{
        const {listing_id, site} = form;

        console.log(site)
        let results;
        switch(site){
            case "HypeBoost":
                const {login_hypeboost,password_hypeboost} = await getHypeBoostCredentials()
                results = await delete_listing(listing_id,login_hypeboost,password_hypeboost)
                break;
        }

        return results;


    })

}


module.exports = {registerMarketplaceHandlers}