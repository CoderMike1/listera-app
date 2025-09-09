
const overview_expose = require('./overview/preload')
const notification_expose = require("./notifications/preload")

const expose = ({contextBridge,ipcRenderer}) =>{

    overview_expose.expose({contextBridge, ipcRenderer})
    notification_expose.expose({contextBridge,ipcRenderer})

}



module.exports = {expose}