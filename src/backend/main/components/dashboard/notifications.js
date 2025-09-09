const {ipcMain} = require("electron")


const registerNotificationsHandlers = ()=>{


    ipcMain.handle("notifications-api:get-all-notifications",()=>{

        const data = [
            {id:1,title:"Added new item",description:"Air Jordan 1 Mid Black White",type:"items",createdAt:"2025-09-08T09:05:00Z"},
            {id: 2, title: "New sale", description: "SKU #A124 sold on Stockx.", type: "info", createdAt: "2025-09-08T08:40:00Z" }
        ]

        return ({ok:true, results:data})


    })


}

module.exports = {registerNotificationsHandlers}