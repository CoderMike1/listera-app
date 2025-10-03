const {app, BrowserWindow, shell} = require("electron")
const path = require("path");
const fs = require("fs/promises")
const {URL} = require("url")


const CLIENT_ID = "1369224929849114654";
const REDIRECT_URI = 'http://localhost:8080/callback';
const REQUIRED_ROLE_ID =  '1349507088186871838';

const EXCHANGE_BASE = 'https://dustify.czechpost.xyz'

const REFRESH_FILE = path.join(app.getPath('userData'), 'refresh_token.txt');

const DISCORD_AUTH_URL =
    `https://discord.com/oauth2/authorize` +
    `?client_id=${encodeURIComponent(CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent('identify guilds guilds.members.read')}`;

async function getDiscordCode() {
    return new Promise((resolve, reject) => {
        let done = false;

        const win = new BrowserWindow({
            width: 520,
            height: 700,
            show: false,
            webPreferences: {
                contextIsolation: true,
                sandbox: true,
                nodeIntegration: false,
            },
        });

        const cleanup = () => {
            try {
                const sess = win.webContents.session;
                sess.webRequest.onBeforeRequest(null); // usuń wszystkie filtry z tego wywołania
            } catch {}
            if (!win.isDestroyed()) win.destroy();
        };

        // 1) Najpewniejszy hak: sieciowy onBeforeRequest na sesji tego okna
        const sess = win.webContents.session;
        const filter = { urls: [ `${REDIRECT_URI}*` ] };

        sess.webRequest.onBeforeRequest(filter, (details, cb) => {
            // Przechwycone KAŻDE żądanie do REDIRECT_URI (main frame, subframe, XHR)
            if (!done) {
                done = true;
                const u = new URL(details.url);
                const code = u.searchParams.get('code');
                cb({ cancel: true });     // przerwij nawigację (nie ładuj localhosta)
                cleanup();
                if (code) resolve(code);
                else reject(new Error('Brak parametru ?code w przekierowaniu'));
                return;
            }
            cb({}); // domyślnie kontynuuj inne żądania
        });

        // 2) (opcjonalnie) zapobiegaj otwieraniu nowych okien
        win.webContents.setWindowOpenHandler(({ url }) => {
            require('electron').shell.openExternal(url);
            return { action: 'deny' };
        });

        // 3) Dla przejrzystości – pokaż okno po załadowaniu
        win.once('ready-to-show', () => win.show());

        // 4) Dodatkowe zabezpieczenie: też zatrzymaj will-redirect/will-navigate
        const intercept = (event, url) => {
            if (url.startsWith(REDIRECT_URI) && !done) {
                event.preventDefault();
                done = true;
                const u = new URL(url);
                const code = u.searchParams.get('code');
                cleanup();
                code ? resolve(code) : reject(new Error('Brak parametru ?code'));
            }
        };
        win.webContents.on('will-redirect', intercept);
        win.webContents.on('will-navigate', intercept);

        // 5) Jeśli użytkownik zamknie okno zanim złapiemy code — rzuć błąd
        win.on('closed', () => {
            if (!done) reject(new Error('Okno logowania zostało zamknięte.'));
        });

        // 6) Start
        win.loadURL(DISCORD_AUTH_URL).catch(err => {
            if (!done) { done = true; cleanup(); reject(err); }
        });
    });
}

const readRefresh = async () =>{
    try{
        const buf = await fs.readFile(REFRESH_FILE, 'utf-8');
        return buf.trim() || null;
    }
    catch{
        return null;
    }
}

const writeRefresh = async (refreshToken) =>{
    await fs.mkdir(path.dirname(REFRESH_FILE), {recursive:true});
    await fs.writeFile(REFRESH_FILE, refreshToken, 'utf-8')
}

const exchangeWithRefresh = async (refreshToken) =>{
    const url = `${EXCHANGE_BASE}/exchange?refresh_token=${encodeURIComponent(refreshToken)}`
    const r = await fetch(url, {method:"GET"});
    return r;
}

const exchangeWithCode = async (code) =>{
    const url = `${EXCHANGE_BASE}/exchange?code=${encodeURIComponent(code)}`;
    const r = await fetch(url, {method:"GET"})
    return r;
}
const getMember = async (accessToken) =>{
    const url = `${EXCHANGE_BASE}/member?authorization=${encodeURIComponent(accessToken)}`;
    const r = await fetch(url, {method:"GET"})
    return r;
}

const validateDiscord = async () =>{
    let valid = false;
    let statusDesc = "";
    let username = '';

    let refreshToken = await readRefresh();

    if(refreshToken){
        let r = await exchangeWithRefresh(refreshToken);

        if(r.status !== 200){
            let errorPayload = {};
            try{
                errorPayload = await r.json()
            }
            catch{}
            const error = errorPayload?.error;

            if(error === 'invalid_grant'){
                const code = await getDiscordCode();
                r = await exchangeWithCode(code);

                if(r.status !== 200){
                    statusDesc = 'error while authorizing'
                    return {statusDesc:statusDesc,username:username,valid:valid}
                }

                const {access_token, refresh_token} = await r.json();
                refreshToken = refresh_token

                const memberResp = await getMember(access_token);
                if(memberResp.status !== 200){
                    statusDesc = 'error while authorizing';
                    return {statusDesc:statusDesc,username:username,valid:valid}
                }

                const member = await memberResp.json();
                username = member?.user?.username || '';
                const roles = member?.roles || [];

                if(roles.includes(REQUIRED_ROLE_ID)){
                    valid = true;
                    statusDesc = 'VALID';
                    await writeRefresh(refreshToken)
                }

                return {statusDesc:statusDesc,username:username,valid:valid}
            }else{
                statusDesc = 'Error while authorizing...';
                return { statusDesc, username, valid };
            }


        }
        else{
            const {access_token, refresh_token} = await r.json();
            refreshToken = refresh_token;

            const memberResp = await getMember(access_token);
            if(memberResp.status !== 200){
                statusDesc = 'Error while authorizing...';
                return { statusDesc, username, valid };
            }

            const member = await memberResp.json();
            username = member?.user?.username || ''
            const roles = member?.roles || [];
            if (roles.includes(REQUIRED_ROLE_ID)) {
                valid = true;
                statusDesc = 'VALID';
                await writeRefresh(refreshToken);
            }

            return { statusDesc, username, valid };
        }

    }
    const code = await getDiscordCode();
    const r = await exchangeWithCode(code);

    if (r.status !== 200) {
        statusDesc = 'Error while authorizing...';
        return { statusDesc, username, valid };
    }

    const { access_token, refresh_token } = await r.json();
    refreshToken = refresh_token;

    const memberResp = await getMember(access_token);
    if (memberResp.status !== 200) {
        statusDesc = 'Error while authorizing...';
        return { statusDesc, username, valid };
    }

    const member = await memberResp.json();
    username = member?.user?.username || '';
    const roles = member?.roles || [];

    if (roles.includes(REQUIRED_ROLE_ID)) {
        valid = true;
        statusDesc = 'VALID';
        await writeRefresh(refreshToken);
    }

    return { statusDesc, username, valid };
}

module.exports = {validateDiscord}


