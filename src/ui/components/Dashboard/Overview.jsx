
import './Overview.css'
import {useEffect, useState} from "react";
import SearchBar from "./SearchBar";



function LineChart({ data = [], endDate }) {
    // --- ustawienia i marginesy (Y-etykiety obok wykresu, X pod wykresem) ---
    const vbW = 110, vbH = 60;                     // trochę większy viewBox → czytelniejsze etykiety
    const margin = { top: 6, right: 4, bottom: 10, left: 18 };

    const x0 = margin.left;
    const yTop = margin.top;
    const yBottom = vbH - margin.bottom;
    const plotW = vbW - margin.left - margin.right;
    const plotH = yBottom - yTop;

    // --- dane wejściowe → mapa po dacie ---
    const map = new Map(
        (Array.isArray(data) ? data : []).map(d => [normalizeISO(d.date), Number(d.sales) || 0])
    );

    // --- ostatnie 30 dni (łącznie, od najstarszego do najnowszego) ---
    const end = endDate ? toUTC(normalizeISO(endDate)) : todayUTC();
    const days = [];
    for (let i = 29; i >= 0; i--) {
        const d = addDaysUTC(end, -i);
        const iso = toISO(d);
        days.push({ iso, label: iso.slice(5), sales: map.get(iso) ?? 0 }); // label = MM-DD
    }

    // --- skale ---
    const maxVal = Math.max(0, ...days.map(d => d.sales));
    const { niceMax, step } = niceScale(maxVal, 5);
    const x = i => x0 + (i / (days.length - 1)) * plotW;              // 0..29 → x
    const y = v => yBottom - (v / (niceMax || 1)) * plotH;            // wartość → y

    // --- ścieżki (linia + obszar) ---
    const lineD = days.map((d, i) => `${i ? "L" : "M"} ${x(i)},${y(d.sales)}`).join(" ");
    const areaD = `${lineD} L ${x(days.length - 1)},${yBottom} L ${x(0)},${yBottom} Z`;

    // --- ticki Y (obok wykresu, po lewej) ---
    const yTicks = [];
    for (let v = 0; v <= niceMax; v += step) yTicks.push(v);

    // --- ticki X: najstarsza | środkowa | ostatnia (z 30 dni) ---
    const iFirst = 0, iMid = Math.floor((days.length - 1) / 2), iLast = days.length - 1;

    return (
        <svg
            className="chart chart--line"
            viewBox={`0 0 ${vbW} ${vbH}`}
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopOpacity="0.25" />
                    <stop offset="100%" stopOpacity="0" />
                </linearGradient>
                {/* przycięcie pola danych → nic nie wyjdzie na legendę */}
                <clipPath id="clip-plot">
                    <rect x={x0} y={yTop} width={plotW} height={plotH} />
                </clipPath>
            </defs>
            {/* --- SIATKA (delikatna, pod danymi) --- */}
            <g clipPath="url(#clip-plot)">
                {yTicks.map(v => {
                    const yy = y(v);
                    return (
                        <line
                            key={`grid-${v}`}
                            x1={x0}
                            y1={yy}
                            x2={x0 + plotW}
                            y2={yy}
                            stroke="#cbd5e1"        // jasny szary (możesz podmienić)
                            strokeWidth="0.3"
                            opacity="0.5"
                        />
                    );
                })}
            </g>
            {/* DANE (pod spodem i przycięte) */}
            <g clipPath="url(#clip-plot)">
                <path className="chart__area" d={areaD} fill="url(#g)" />
                <path className="chart__line" d={lineD} />
            </g>

            {/* OSIE (na wierzchu) */}
            <line x1={x0} y1={yTop} x2={x0} y2={yBottom} className="chart__axis" />
            <line x1={x0} y1={yBottom} x2={x0 + plotW} y2={yBottom} className="chart__axis" />

            {/* Y: etykiety OBOK (na lewo od osi) */}
            <g className="chart__ticks" fontSize="7" fontWeight="600">
                {yTicks.map(v => {
                    const yy = y(v);
                    return (
                        <g key={v}>
                            <line x1={x0} x2={x0 + 2.5} y1={yy} y2={yy} className="chart__tick" />
                            <text x={x0 - 2} y={yy} textAnchor="end" dominantBaseline="middle" className="chart__tick__text">
                                {v}
                            </text>
                        </g>
                    );
                })}
            </g>

            <g className="chart__ticks" fontSize="6" fontWeight="600">
                <line x1={x(iFirst)} y1={yBottom} x2={x(iFirst)} y2={yBottom - 2.5} className="chart__tick" />
                <text x={x(iFirst)} y={yBottom + 3} textAnchor="start" dominantBaseline="hanging" className="chart__tick__text">{days[iFirst].label}</text>

                <line x1={x(iMid)} y1={yBottom} x2={x(iMid)} y2={yBottom - 2.5} className="chart__tick" />
                <text x={x(iMid)} y={yBottom + 3} textAnchor="middle" dominantBaseline="hanging" className="chart__tick__text">{days[iMid].label}</text>

                <line x1={x(iLast)} y1={yBottom} x2={x(iLast)} y2={yBottom - 2.5} className="chart__tick" />
                <text x={x(iLast)} y={yBottom + 3} textAnchor="end" dominantBaseline="hanging" className="chart__tick__text">{days[iLast].label}</text>
            </g>
        </svg>
    );

    // --- utils: ładna skala Y ---
    function niceScale(maxValue, tickCount = 5) {
        const m = Math.max(0, maxValue);
        if (m === 0) return { niceMax: 1, step: 1 };
        const roughStep = m / (tickCount - 1);
        const pow10 = Math.pow(10, Math.floor(Math.log10(roughStep)));
        const candidates = [1, 2, 2.5, 5, 10].map(k => k * pow10);
        const step = candidates.find(s => s >= roughStep) ?? candidates[candidates.length - 1];
        const niceMax = Math.ceil(m / step) * step;
        return { niceMax, step };
    }

    function todayUTC() {
        const now = new Date();
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    }
    function toUTC(iso) {
        const [y, m, d] = iso.split("-").map(Number);
        return new Date(Date.UTC(y, m - 1, d));
    }
    function addDaysUTC(date, delta) {
        const d = new Date(date.getTime());
        d.setUTCDate(d.getUTCDate() + delta);
        return d;
    }
    function toISO(date) {
        const y = date.getUTCFullYear();
        const m = String(date.getUTCMonth() + 1).padStart(2, "0");
        const d = String(date.getUTCDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }
    function normalizeISO(s) {
        if (!s) return s;
        const str = String(s).trim();
        if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(str)) {
            return str.replace(/\//g, "-");
        }
        if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
            const [dd, mm, yyyy] = str.split("-");
            return `${yyyy}-${mm}-${dd}`;
        }
        return str;
    }
}

function Donut({ active = 22 }) {
    const r = 15.915;
    const c = 2 * Math.PI * r;
    const arc = (active / 100) * c;
    const sold = 100 - active;

    // środek i promień dla napisów (trochę mniejszy niż r, żeby były wewnątrz pierścienia)
    const cx = 18, cy = 18;
    const labelR = 11;

    // chcemy start od godz. 12, więc kąt początkowy = -90°
    const start = -Math.PI / 2;

    // środki kątowe obu łuków
    const thetaActiveMid = start + (active / 100) * 2 * Math.PI / 2;
    const thetaSoldMid   = start + (active / 100) * 2 * Math.PI + (sold / 100) * 2 * Math.PI / 2;

    // współrzędne etykiet
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
                <text className="donut_text" x={ax} y={ay} textAnchor="end" dominantBaseline="middle">
                    {active}%
                </text>
                <text className="donut_text" x={sx} y={sy} textAnchor="start" dominantBaseline="middle">
                    {sold}%
                </text>
            </g>
        </svg>
    );
}

const Overview = () =>{

    const [lastSales,setLastSales] = useState([])
    const [kpisData,setKpisData] = useState([])
    const [listingStatusData,setListingStatusData] = useState([])


    const todayLabel = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: "Europe/Warsaw",
    }).format(new Date());

    useEffect(()=>{
        const r1 = async ()=>{
            const resp = await window.overview.api_get_sales_from_last_30_days()
            if(!resp.ok){
                throw new Error()
            }
            else{
                setLastSales(resp.result)
            }
        }

        const r2 = async () =>{
            const resp = await window.overview.api_get_kpis_data()
            if(!resp.ok){
                throw new Error()
            }
            else{
                setKpisData(resp.result)
            }
        }

        const r3 = async () =>{
            const resp = await window.overview.api_get_listing_status()
            if(!resp.ok){
                throw new Error()
            }
            else{
                setListingStatusData(resp.result)
            }
        }

        r1()
        r2()
        r3()

    })

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
                        data={lastSales}
                     />
                </article>
                <article className="card">
                    <div className="card__title">Listing Status</div>
                    <Donut active={listingStatusData.active} />
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

export default Overview