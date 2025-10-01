const {app,ipcMain} = require("electron")
const fs = require('fs/promises')
const path = require('path')
const CONFIG_NAME = "settings.json"

const DEFAULT_SETTINGS = {login_hypeboost:"",password_hypeboost:""}


const loadSettings = async () =>{
//app.getPath("userData")
    const configPath = path.join('C:\\Users\\mike\\AppData\\Roaming\\listera-app',CONFIG_NAME);
//C:\Users\mike\AppData\Roaming\listera-app

    try{
        await fs.access(configPath)

        const raw = await fs.readFile(configPath,'utf8');

        const json = JSON.parse(raw);
        return {
            login_hypeboost : String(json.login_hypeboost ?? ''),
            password_hypeboost : String(json.password_hypeboost ?? '')
        }

    }
    catch{
        await fs.writeFile(configPath,JSON.stringify(DEFAULT_SETTINGS,null,2), 'utf-8')
        return {...DEFAULT_SETTINGS}
    }


}


const registerSettingsHandlers = () =>{

    ipcMain.handle("settings_api:get_hypeboost_credentials",async ()=>{

        return await loadSettings()

    })

}


module.exports = {registerSettingsHandlers,loadSettings}