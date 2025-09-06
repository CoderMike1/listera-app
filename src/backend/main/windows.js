const path = require("path")
const {app, BrowserWindow} = require("electron")

const isDev = !app.isPackaged;
const DEV_URL = process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";


const createMainWindow = () =>{

    const win = new BrowserWindow({
        width:1100,
        height:750,
        show:false,
        webPreferences:{
            preload:path.join(__dirname,"..","preload","index.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        }
    });

    win.once("ready-to-show",() => win.show())

    // win.loadFile(path.join(__dirname,"..","renderer","dashboard","index.html"))

    if(isDev){
        win.loadURL(DEV_URL+"#/dashboard")
    }
    else{
        win.loadFile(path.join(__dirname,"..","..","src", "renderer", "dist", "index.html"))
    }
    return win;

}

module.exports = {createMainWindow}