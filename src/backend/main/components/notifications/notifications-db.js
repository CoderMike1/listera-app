const ES = require("electron-store")
const Store = ES.default || ES;
const {BrowserWindow} = require('electron')


const store = new Store({
    name: 'notifications',
    defaults: { list: [] }
})


const buildNotif = (payload) =>{
    return {
        id: crypto.randomUUID(),
        level : payload.level ?? 'info',
        title: payload.title ?? null,
        message : String(payload.message ?? ''),
        createdAt : Date.now(),
        sticky: !!payload.sticky,
        timeoutMs: payload.timeoutMs ?? 5000,
        read:false
    };
}

const persist = (notif) =>{
    const list = store.get('list');
    list.push(notif);

    if(list.length > 500) list.splice(0, list.length -500);
    store.set('list',list)
}

const broadcast = (channel,data)=> {
    for(const win of BrowserWindow.getAllWindows()){
        win.webContents.send(channel,data)
    }
}


module.exports = {buildNotif,persist,broadcast,store}



