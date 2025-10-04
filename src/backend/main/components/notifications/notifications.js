const {ipcMain} = require("electron")
const {buildNotif, persist, broadcast, store} = require("./notifications-db");

const registerNotificationsHandlers = () =>{

    ipcMain.handle("notifications_api:add",(_e,payload)=>{
        const notif = buildNotif(payload);
        persist(notif);
        broadcast("notifications_api:new",notif)
        return {ok:true, notif}
    })

    ipcMain.handle('notifications_api:list', (_e, { offset = 0, limit = 100 } = {}) => {
        const list = store.get('list');
        const slice = [...list].reverse().slice(offset, offset + limit);
        return { ok: true, items: slice, total: list.length };
    });

    ipcMain.handle('notifications_api:markRead', (_e, id) => {
        const list = store.get('list');
        const idx = list.findIndex(n => n.id === id);
        if (idx >= 0) {
            list[idx].read = true;
            store.set('list', list);
        }
        return { ok: true };
    });

    ipcMain.handle('notifications_api:clear', () => {
        store.set('list', []);
        return { ok: true };
    });
}

module.exports = {registerNotificationsHandlers}