const {contextBridge,ipcRenderer} = require('electron')

const login_api = require('./login/preload')
const dashboard_api = require('./dashboard/preload')
const items_api = require('./items/preload')

login_api.expose({contextBridge, ipcRenderer})
dashboard_api.expose({contextBridge,ipcRenderer})
items_api.expose({contextBridge,ipcRenderer})
