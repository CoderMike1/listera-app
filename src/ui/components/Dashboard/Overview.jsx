
import './Overview.css'
import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import SearchBar from "./SearchBar";


const LineChart = ({sales = [],
                       height=220}) =>{
    const range = 30;
    const wrapRef = useRef(null);
    const [size, setSize] = useState({ w: 360, h: height });
    useLayoutEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const ro = new ResizeObserver((entries) => {
            for (const e of entries) {
                const cr = e.contentRect;
                const w = Math.max(260, Math.floor(cr.width));
                const h = Math.max(160, Math.floor(cr.height));
                setSize({ w, h });
            }
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);


    const toYMDUTC = (d) => {
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, "0");
        const day = String(d.getUTCDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };
    const parseYMD = (s) => new Date(`${s}T00:00:00Z`);


    const salesMap = useMemo(() => {
        const m = new Map();
        for (const s of sales) {
            const key = String(s?.date || "").slice(0, 10);
            const c = Number.isFinite(s?.count) ? s.count : 1;
            if (key) m.set(key, (m.get(key) || 0) + c);
        }
        return m;
    }, [sales]);

    const dayKeys = useMemo(() => {
        const keys = [];
        const now = new Date();
        const endUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const startUTC = new Date(endUTC);
        startUTC.setUTCDate(endUTC.getUTCDate() - (range - 1));
        for (let d = new Date(startUTC); d <= endUTC; d.setUTCDate(d.getUTCDate() + 1)) {
            keys.push(toYMDUTC(d));
        }
        return keys;
    }, [range]);


    const seriesSold = useMemo(() => dayKeys.map((k) => salesMap.get(k) || 0), [dayKeys, salesMap]);


    const W = size.w;
    const H = size.h;
    const P = Math.max(24, Math.min(36, Math.round(W * 0.07)));
    const innerW = W - P - 10;
    const innerH = H - P - 12;

    const maxY = Math.max(1, ...seriesSold);
    const niceMax = niceCeil(maxY);
    const yTicks = [0, niceMax * 0.25, niceMax * 0.5, niceMax * 0.75, niceMax];

    const n = dayKeys.length;
    const xOf = (i) => P + (i * innerW) / (n - 1 || 1);
    const yOf = (v) => P + innerH - (v / (niceMax || 1)) * innerH;

    const dLineSold = seriesSold.map((v, i) => `${i === 0 ? "M" : "L"} ${xOf(i)} ${yOf(v)}`).join(" ");
    const dArea =
        `M ${xOf(0)} ${yOf(0)} ` +
        seriesSold.map((v, i) => `L ${xOf(i)} ${yOf(v)}`).join(" ") +
        ` L ${xOf(n - 1)} ${yOf(0)} Z`;


    const fs = Math.max(12, Math.min(16, Math.round(W * 0.04)));
    const fsSmall = Math.max(12, Math.min(14, Math.round(W * 0.035)));
    const strokeW = Math.max(2, Math.min(3, Math.round(W * 0.007)));

    const fmt = (s) =>
        parseYMD(s).toLocaleDateString(undefined, { month: "2-digit", day: "2-digit" });
    const xLabels = [
        fmt(dayKeys[0] || toYMDUTC(new Date())),
        fmt(dayKeys[Math.floor((n - 1) / 2)] || toYMDUTC(new Date())),
        fmt(dayKeys[n - 1] || toYMDUTC(new Date())),
    ];

    return (
        <div className="sold-card">
            <div className="sold-chart-wrap" ref={wrapRef}>
                <svg
                    className="sold-chart"
                    viewBox={`0 0 ${W} ${H}`}
                    width="100%"
                    height="100%"
                    preserveAspectRatio="none"
                >
                    <rect x="0" y="0" width={W} height={H} rx="14" className="chart-bg" />

                    <line x1={P} y1={P} x2={P} y2={P + innerH} className="axis" />
                    <line x1={P} y1={P + innerH} x2={P + innerW} y2={P + innerH} className="axis" />

                    {yTicks.map((t, i) => {
                        const y = yOf(t);
                        return (
                            <g key={i}>
                                <line x1={P} y1={y} x2={P + innerW} y2={y} className="grid" />
                                <text
                                    x={P - 6}
                                    y={y}
                                    className="tick-y"
                                    dominantBaseline="middle"
                                    style={{ fontSize: fsSmall }}
                                >
                                    {Math.round(t)}
                                </text>
                            </g>
                        );
                    })}


                    <path d={dArea} className="area" />
                    <path d={dLineSold} className="line" style={{ strokeWidth: strokeW }} />


                    {seriesSold.map((v, i) =>
                        v > 0 ? <circle key={`s-${i}`} cx={xOf(i)} cy={yOf(v)} r={strokeW + 1} className="dot" /> : null
                    )}

                    <text x={P} y={P + innerH + 14} className="tick-x" textAnchor="start" style={{ fontSize: fs }}>
                        {xLabels[0]}
                    </text>
                    <text
                        x={P + innerW / 2}
                        y={P + innerH + 14}
                        className="tick-x"
                        textAnchor="middle"
                        style={{ fontSize: fs }}
                    >
                        {xLabels[1]}
                    </text>
                    <text
                        x={P + innerW}
                        y={P + innerH + 14}
                        className="tick-x"
                        textAnchor="end"
                        style={{ fontSize: fs }}
                    >
                        {xLabels[2]}
                    </text>
                </svg>
            </div>
        </div>
    );
}

const Donut = ({listingAmount}) =>{

    const activeCount = Number(listingAmount.active) || 0;
    const soldCount = (Number(listingAmount.sold) || 0) + (Number(listingAmount.toship) || 0)


    const total = Math.max(1,activeCount+soldCount);
    let activePct = (activeCount / total) * 100;
    activePct = Math.max(0,Math.min(100,activePct))
    const soldPct = 100 - activePct;

    const r = 15.915;
    const c = 2*Math.PI * r;
    const arc = (activePct/100) * c;

    const cx = 18, cy=18;
    const labelR = 10;
    const start = -Math.PI / 2;

    const thetaActiveMid = start + (activePct / 100) * Math.PI;
    const thetaSoldMid = start + (activePct / 100) * 2 * Math.PI + (soldPct / 100);

    const ax = cx + labelR * Math.cos(thetaActiveMid);
    const ay = cy + labelR * Math.sin(thetaActiveMid);
    const sx = cx + labelR * Math.cos(thetaSoldMid);
    const sy = cy + labelR * Math.sin(thetaSoldMid);


    return (
        <svg className="chart chart--donut" viewBox="0 0 36 36" aria-hidden="true">
            <circle className="donut__track" cx={cx} cy={cy} r={r} />
            <circle
                className="donut__value"
                cx={cx}
                cy={cy}
                r={r}
                strokeDasharray={`${arc} ${c - arc}`}
            />
            <g className="donut__labels" fontSize="3" fontWeight="600">
                <text className="donut_text" x={ax} y={ay} textAnchor="middle" dominantBaseline="middle">
                    {Math.round(activePct)}%
                </text>
                <text className="donut_text" x={sx} y={sy} textAnchor="middle" dominantBaseline="middle">
                    {Math.round(soldPct)}%
                </text>
            </g>
        </svg>
    )
}


const Overview = () =>{

    const [lastSales,setLastSales] = useState([])
    const [kpisData,setKpisData] = useState([])
    const [listingAmount,setListingAmount] = useState([])


    const todayLabel = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: "Europe/Warsaw",
    }).format(new Date());

    useEffect(()=>{
        const r1 = async ()=>{
            const resp = await window.stats.api_get_sales()

            if(!resp.ok){
                throw new Error()
            }
            else{
                setLastSales(resp.results)
            }
        }

        const r2 = async () =>{
            const resp = await window.overview.api_get_kpis_data()
            if(!resp.ok){
                throw new Error()
            }
            else{
                setKpisData(resp.results)
            }
        }

        const r3 = async () => {
            const resp = await window.overview.api_get_listing_status()
            if (!resp.ok) {
                throw new Error()
            } else {
                setListingAmount(resp.results)
            }
        }

        r1()
        r2()
        r3()
    },[])

    return (
        <div className="middle-container">
            <SearchBar/>
            <header className="middle-container__header">
                <h1>Welcome back, Mike!</h1>
                <p className="muted">{todayLabel}</p>
            </header>

            <section className='kpis'>
                {kpisData.map(k=>(
                    <article key={k.label} className="card kpi">
                        <div className="kpi__label">{k.label}</div>
                        <div className="kpi__value">{k.value}</div>
                    </article>
                ))}
            </section>

            <section className="charts">
                <article className="card">
                    <div className="card__title">Sold Last 30 Days</div>
                    <LineChart
                        sales={lastSales}
                     />
                </article>
                <article className="card">
                    <div className="card__title">Listing Status</div>
                    <Donut listingAmount={listingAmount} />
                    <div className="legend">
                        <div className="legend-dot-part">
                            <span className="dot dot--primary" />
                            <span>Active</span>
                        </div>
                        <div className="legend-dot-part">
                            <span className="dot dot--muted" />
                            <span>Sold</span>
                        </div>
                    </div>
                </article>
            </section>




        </div>
    )


}

function niceCeil(n) {
    if (n <= 10) return 10;
    const pow10 = Math.pow(10, Math.floor(Math.log10(n)));
    const step = [1, 2, 5, 10].find((s) => n <= s * pow10) || 10;
    return step * pow10;
}




export default Overview

