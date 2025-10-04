import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

const Ctx = createContext(null);
export const useNotifications = () => useContext(Ctx);

const NotificationProvider = ({children}) =>{

    const [toasts, setToasts] = useState([])
    const [history,setHistory] = useState([]);
    const audioRef = useRef(null);


    useEffect(() => {
        (async () => {
            const r = await window.notify.list(200);
            if (r?.ok) setHistory(r.items);
        })();
        audioRef.current = new Audio('/sounds/notify.mp3');
    }, []);

    useEffect(() => {
        const off = window.notify.onNew((n) => {
            setHistory(h => [n, ...h]);
            setToasts(t => [...t, n]);
            try { audioRef.current.currentTime = 0; audioRef.current.play(); } catch {}
        });
        return () => off?.();
    }, []);

    const removeToast = (id) => setToasts(t => t.filter(x => x.id !== id));

    const value = useMemo(() => ({
        history,
        push: (p) => window.notify.add(p),     // możesz wywołać z dowolnej podstrony przez hook
        clearHistory: () => window.notify.clear().then(() => setHistory([])),
    }), [history]);

    return (
        <Ctx.Provider value={value}>
            {children}
            <ToastShelf toasts={toasts} onClose={removeToast} />
        </Ctx.Provider>
    );

}

function ToastShelf({ toasts, onClose }) {
    return (
        <div style={{
            position:'fixed', top:16, right:16, zIndex:9999,
            display:'flex', flexDirection:'column', gap:8, pointerEvents:'none'
        }}>
            {toasts.map(t => <Toast key={t.id} notif={t} onClose={() => onClose(t.id)} />)}
        </div>
    );
}
function Toast({ notif, onClose }) {
    const { title, message, level='info', timeoutMs=10000, sticky } = notif;
    const [hover, setHover] = useState(false);
    const [left, setLeft] = useState(100);

    useEffect(() => {
        if (sticky) return;
        const start = Date.now(); let raf;
        const tick = () => {
            if (!hover) {
                const p = Math.max(0, 100 - ((Date.now() - start)/timeoutMs)*100);
                setLeft(p);
                if (p === 0) return onClose();
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [hover, timeoutMs, sticky, onClose]);

    const border = { info:'#7dd3fc', success:'#86efac', warn:'#fcd34d', error:'#fca5a5' }[level];
    const bar    = { info:'#38bdf8', success:'#22c55e', warn:'#f59e0b', error:'#ef4444' }[level];

    return (
        <div
            style={{
                pointerEvents:'auto', width:320, background:'#fff', borderRadius:12,
                fontFamily: '"Inter", sans-serif',
                boxShadow:'0 10px 25px rgba(0,0,0,.1)', border:`1px solid ${border}`, padding:12
            }}
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            role="status"
        >
            <div style={{ display:'flex', alignItems:'start', gap:8 }}>
                <div style={{ fontWeight:600, fontSize:14,fontFamily: '"Inter", sans-serif', }}>{title || level.toUpperCase()}</div>
                <button onClick={onClose} style={{ marginLeft:'auto' }}>×</button>
            </div>
            <div style={{ fontSize:14, fontFamily: '"Inter", sans-serif',color:'#374151', whiteSpace:'pre-wrap', marginTop:4 }}>{message}</div>
            {!sticky && (
                <div style={{ height:4, marginTop:8, borderRadius:999, background:'#e5e7eb', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${left}%`, background:bar }} />
                </div>
            )}
        </div>
    );
}

export default NotificationProvider