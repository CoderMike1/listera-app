const {contextBridge,ipcRenderer} = require('electron')

const login_api = require('./login/preload')
const dashboard_api = require('./dashboard/preload')
const items_api = require('./items/preload')
const stats_api = require("./stats/preload")

login_api.expose({contextBridge, ipcRenderer})
dashboard_api.expose({contextBridge,ipcRenderer})
items_api.expose({contextBridge,ipcRenderer})
stats_api.expose({contextBridge,ipcRenderer})