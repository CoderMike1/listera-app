const {ipcMain} = require("electron")
const {validateDiscord} = require("./oauth-discord");


const registerLoginHandlers = () =>{

    ipcMain.handle("login:api-authorize",async () =>{
        let statusDesc = '';
        let username='';
        try {
            const res = await validateDiscord();
            const valid = res?.valid || false;
            statusDesc = res?.statusDesc;
            username = res?.username;
            return {statusDesc:statusDesc,username:username,valid:valid}
        } catch (err) {
            console.log(err)
            return {statusDesc:err,username:"",valid:false}
            }


    })

}

module.exports = {registerLoginHandlers}