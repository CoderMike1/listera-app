const path = require("path")
const {app, BrowserWindow} = require("electron")
const {login} = require("./components/marketplace/sites/hypeboost/main");

const isDev = !app.isPackaged;
const DEV_URL = process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";


const createMainWindow = () =>{

    const win = new BrowserWindow({
        width:1300,
        height:750,
        show:false,
        // resizable: false,
        webPreferences:{
            preload:path.join(__dirname,"..","preload","index.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        }
    });

    win.webContents.openDevTools()

    win.once("ready-to-show",() => win.show())


    if(isDev){
        win.loadURL(DEV_URL+"#/login")
    }
    else{
        win.loadFile(path.join(__dirname,"..","..","src", "renderer", "dist", "index.html"))
    }
    return win;

}

module.exports = {createMainWindow}