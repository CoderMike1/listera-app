const {ipcMain} = require("electron")


const registerLoginHandlers = () =>{

    ipcMain.handle("login:api-authorize",() =>{

        // jakies procesy

        return {ok:true}

    })

}

module.exports = {registerLoginHandlers}