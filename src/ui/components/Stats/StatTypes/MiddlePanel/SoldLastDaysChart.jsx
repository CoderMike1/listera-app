import React, { useMemo, useState, useRef, useLayoutEffect } from "react";
import "./SoldLastDaysChart.css";

export default function SoldLastDaysChart({
                                              sales = [],
                                              purchases = [],
                                              initialRangeDays = 30,
                                              selectedStat,
                                              setSelectedStat,
                                              height
                                          }) {
    const [range, setRange] = useState(initialRangeDays);


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

    const purchasesMap = useMemo(() => {
        const m = new Map();
        for (const p of purchases) {
            const key = String(p?.date || "").slice(0, 10);
            const c = Number.isFinite(p?.count) ? p.count : 1;
            if (key) m.set(key, (m.get(key) || 0) + c);
        }
        return m;
    }, [purchases]);


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
    const seriesPurch = useMemo(() => dayKeys.map((k) => purchasesMap.get(k) || 0), [dayKeys, purchasesMap]);


    const W = size.w;
    const H = size.h;
    const P = Math.max(24, Math.min(36, Math.round(W * 0.07)));
    const innerW = W - P - 10;
    const innerH = H - P - 12;

    const maxY = Math.max(1, ...seriesSold, ...seriesPurch); // ⬅️ skala pod obie serie
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

    const dLinePurch = seriesPurch.map((v, i) => `${i === 0 ? "M" : "L"} ${xOf(i)} ${yOf(v)}`).join(" ");


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
            <div className="sold-card__head">
                <h3>Sold Last {range} Days</h3>

                {selectedStat !== 1 ?
                    <button className="sold-card-btn" onClick={() => setSelectedStat(1)}>Expand</button>
                    :
                    <button className="sold-card-btn" onClick={() => setSelectedStat(null)}>Close</button>
                }

                <div className="sold-card__range">
                    {[30, 60, 90, 360].map((r) => (
                        <button
                            key={r}
                            className={`range-btn ${range === r ? "is-active" : ""}`}
                            onClick={() => setRange(r)}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* kontener, którego rozmiar mierzymy */}
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


                    <path d={dLinePurch} className="line line--purchases" style={{ strokeWidth: strokeW }} />

                    {seriesSold.map((v, i) =>
                        v > 0 ? <circle key={`s-${i}`} cx={xOf(i)} cy={yOf(v)} r={strokeW + 1} className="dot" /> : null
                    )}
                    {seriesPurch.map((v, i) =>
                        v > 0 ? <circle key={`p-${i}`} cx={xOf(i)} cy={yOf(v)} r={strokeW + 1} className="dot dot--purchases" /> : null
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

function niceCeil(n) {
    if (n <= 10) return 10;
    const pow10 = Math.pow(10, Math.floor(Math.log10(n)));
    const step = [1, 2, 5, 10].find((s) => n <= s * pow10) || 10;
    return step * pow10;
}
