const {contextBridge,ipcRenderer} = require('electron')

const login_api = require('./login/preload')

login_api.expose({contextBridge, ipcRenderer})