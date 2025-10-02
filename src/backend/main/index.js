const {app} = require('electron')
const {createMainWindow} = require("./windows")
const {registerLoginHandlers} = require("./components/login");
const {registerDashboardHandlers} = require('./components/dashboard/dashboard')
const {registerNotificationsHandlers} = require("./components/dashboard/notifications");
const {registerItemsHandlers} = require("./components/items/items");
const {registerStatsHandlers} = require("./components/stats/stats")
const {ensureCsvExists} = require("./components/marketplace/tasks");
const {registerMarketplaceHandlers} = require("./components/marketplace/marketplace");
const {registerSettingsHandlers, loadSettings, checkSettingsFormat} = require("./components/settings");

app.whenReady().then(() =>{
    ensureCsvExists()
    checkSettingsFormat()
    registerLoginHandlers()
    registerDashboardHandlers()
    registerNotificationsHandlers()
    registerItemsHandlers()
    registerStatsHandlers()
    registerMarketplaceHandlers()
    registerSettingsHandlers()



    createMainWindow()
})


app.on("window-all-closed",() =>{
    if(process.platform !== 'darwin'){
        app.quit()
    }
})