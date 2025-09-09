const {contextBridge,ipcRenderer} = require('electron')

const login_api = require('./login/preload')
const dashboard_api = require('./dashboard/preload')


login_api.expose({contextBridge, ipcRenderer})
dashboard_api.expose({contextBridge,ipcRenderer})