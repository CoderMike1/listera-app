const {ipcMain} = require('electron')
const tasks = require("./tasks");
const {add_listing} = require("./sites/hypeboost/main");


const registerMarketplaceHandlers = () =>{

    ipcMain.handle('marketplace_api:get_tasks',()=>{
        const results = tasks.readTasks()
        return {ok:true,results:results}

    })

    ipcMain.handle("marketplace_api:add_task",(_e,task)=>{

        const results = tasks.addTask(task);
        return {ok:true,results:results}
    })

    ipcMain.handle("marketplace_api:delete_task",(_e,task_id)=>{
        const results = tasks.deleteTask(task_id);

        return {ok:true,results:results}
    })

    ipcMain.handle("marketplace_api:add_listing",async (_e,form)=>{
        let results;
        console.log(form)
        switch (form.site){
            case "HypeBoost":
                console.log("gitaar")
                results = await add_listing(form.sku,form.size,form.payout_price,form.minimum_price);
                break;
        }

        return {ok:true,results:results}


    })

}


module.exports = {registerMarketplaceHandlers}