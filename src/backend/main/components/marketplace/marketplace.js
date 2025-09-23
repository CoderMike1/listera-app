const {ipcMain} = require('electron')
const tasks = require("./tasks");


const registerMarketplaceHandlers = () =>{

    ipcMain.handle('marketplace_api:get_tasks',()=>{

        const results = tasks.readTasks()

        return {ok:true,results}

    })

}


module.exports = {registerMarketplaceHandlers}