const {ipcMain} = require("electron")


const registerLoginHandlers = () =>{

    ipcMain.handle("login:api-authorize",() =>{

        // auth process in the background

        return {ok:true}

    })

}

module.exports = {registerLoginHandlers}