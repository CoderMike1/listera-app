const {app} = require('electron')
const {createMainWindow} = require("./windows")
const {registerLoginHandlers} = require("./components/login");
const {registerDashboardHandlers} = require('./components/dashboard/dashboard')
const {registerNotificationsHandlers} = require("./components/dashboard/notifications");
const {registerItemsHandlers} = require("./components/items/items");
const {registerStatsHandlers} = require("./components/stats/stats")
app.whenReady().then(() =>{

    registerLoginHandlers()
    registerDashboardHandlers()
    registerNotificationsHandlers()
    registerItemsHandlers()
    registerStatsHandlers()

    createMainWindow()
})


app.on("window-all-closed",() =>{
    if(process.platform !== 'darwin'){
        app.quit()
    }
})