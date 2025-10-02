const {app,ipcMain} = require("electron")
const fs = require('fs/promises')
const path = require('path')
const CONFIG_NAME = "settings.json"

const DEFAULT_SETTINGS = {login_hypeboost:"",password_hypeboost:"",currency:"EUR"}


const CONFIG_PATH = path.join(app.getPath("userData"),CONFIG_NAME);


const loadSettings = async () =>{



    try{
        await fs.access(CONFIG_PATH)

        const raw = await fs.readFile(CONFIG_PATH,'utf8');

        const json = JSON.parse(raw);
        return {
            login_hypeboost : String(json.login_hypeboost ?? ''),
            password_hypeboost : String(json.password_hypeboost ?? '')
        }

    }
    catch{
        await fs.writeFile(CONFIG_PATH,JSON.stringify(DEFAULT_SETTINGS,null,2), 'utf-8')
        return {...DEFAULT_SETTINGS}
    }

}

const loadCurrencySettings = async () =>{
    try{
        await fs.access(CONFIG_PATH)

        const raw = await fs.readFile(CONFIG_PATH,'utf8');

        const json = JSON.parse(raw);
        return {
            currency: String(json.currency ?? 'EUR')
        }

    }
    catch{
        await fs.writeFile(CONFIG_PATH,JSON.stringify(DEFAULT_SETTINGS,null,2), 'utf-8')
        return {...DEFAULT_SETTINGS}
    }
}


const readJSON = async () =>{
    const buf = await fs.readFile(CONFIG_PATH)
    return JSON.parse(buf.toString())
}
const writeJSON = async (obj) =>{
    await fs.writeFile(CONFIG_PATH, JSON.stringify(obj,null,2),'utf-8')
}

const setCredentials = async ({login_hypeboost,password_hypeboost}) =>{

    const cfg = await readJSON()
    cfg.login_hypeboost = login_hypeboost ?? '';
    cfg.password_hypeboost = password_hypeboost ?? '';

    await writeJSON(cfg)
    return {ok:true}

}

const checkSettingsFormat = async () =>{

    await fs.mkdir(path.dirname(CONFIG_PATH),{recursive:true})

    let settings = await readJSON(CONFIG_PATH)

    if(settings == null){
        settings = { ...DEFAULT_SETTINGS };
        await writeJson(CONFIG_PATH, settings);
        return settings;
    }

    const changed = applyDefaults(settings, DEFAULT_SETTINGS);
    if (changed) {
        await writeJson(CONFIG_PATH, settings);
    }
    return settings;

}
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
function applyDefaults(obj, defaults) {
    let changed = false;
    for (const key of Object.keys(defaults)) {
        const defVal = defaults[key];
        const curVal = obj[key];

        if (isObj(defVal)) {
            if (!isObj(curVal)) {
                obj[key] = {};
                changed = true;
            }
            if (applyDefaults(obj[key], defVal)) changed = true;
        } else {
            if (curVal === undefined) {
                obj[key] = defVal;
                changed = true;
            }
        }
    }
    return changed;
}

async function writeJson(file, obj) {
    const data = JSON.stringify(obj, null, 2);
    await fs.writeFile(file, data, 'utf8');
}
async function readJsonSafe(file) {
    try {
        const raw = await fs.readFile(file, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        if (e.code === 'ENOENT') return null;
        try { await fs.copyFile(file, `${file}.bak-${Date.now()}`); } catch {}
        return null;
    }
}

const registerSettingsHandlers = () =>{

    ipcMain.handle("settings_api:get_hypeboost_credentials",async ()=>{

        return await loadSettings()

    })

    ipcMain.handle("settings_api:set_hypeboost_credentials", async (_e,form) =>{

        return await setCredentials(form)

    })
    ipcMain.handle("settings_api:get_currency_settings",async ()=>{
        const resp =  await loadCurrencySettings()

        return {ok:true, results:resp}

    })

}

const getHypeBoostCredentials = async ()=>{
    return await loadSettings()
}




module.exports = {registerSettingsHandlers,loadSettings,getHypeBoostCredentials,checkSettingsFormat}