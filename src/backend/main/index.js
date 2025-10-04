const {app} = require('electron')
const cron = require("node-cron")
const {createMainWindow} = require("./windows")
const {registerLoginHandlers} = require("./components/login");
const {registerDashboardHandlers} = require('./components/dashboard/dashboard')
const {registerItemsHandlers} = require("./components/items/items");
const {registerStatsHandlers} = require("./components/stats/stats")
const {ensureCsvExists} = require("./components/marketplace/tasks");
const {registerMarketplaceHandlers} = require("./components/marketplace/marketplace");
const {registerSettingsHandlers, loadSettings, checkSettingsFormat} = require("./components/settings");
const {registerNotificationsHandlers} = require("./components/notifications/notifications");
const {checkIfSold} = require("./components/marketplace/sites/hypeboost/checkIfSold");


let jobRunning = false;
async function safeCheckIfSold() {
    if (jobRunning) return;
    jobRunning = true;
    try {
        await checkIfSold();
    } catch (e) {
        console.error('[checkIfSold]', e?.message || e);
    } finally {
        jobRunning = false;
    }
}

app.whenReady().then(() =>{
    ensureCsvExists()
    checkSettingsFormat()
    registerLoginHandlers()
    registerDashboardHandlers()
    registerItemsHandlers()
    registerStatsHandlers()
    registerMarketplaceHandlers()
    registerSettingsHandlers()
    registerNotificationsHandlers()





    createMainWindow()

    safeCheckIfSold();

    cron.schedule(('30 * * * *'), ()=>safeCheckIfSold())

})


app.on("window-all-closed",() =>{
    if(process.platform !== 'darwin'){
        app.quit()
    }
})