const {app} = require('electron')
const {createMainWindow} = require("./windows")

app.whenReady().then(() =>{

    createMainWindow()
})


app.on("window-all-closed",() =>{
    if(process.platform !== 'darwin'){
        app.quit()
    }
})