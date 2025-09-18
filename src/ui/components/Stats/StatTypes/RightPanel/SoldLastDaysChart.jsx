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

    const [tt, setTt] = useState({ show: false, x: 0, y: 0, date: "", value: 0 });

    const fmtFull = (d) =>
        d.toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });

    const wrapRef = useRef(null);
    const [size, setSize] = useState({ w: 360, h: height ?? 440 });

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


    const [range, setRange] = useState(initialRangeDays);
    const [mode, setMode] = useState("Sold");


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
            const key = String(s.date || "").slice(0, 10);
            const c = typeof s.count === "number" ? s.count : 1;
            if (key) m.set(key, (m.get(key) || 0) + c);
        }
        return m;
    }, [sales]);

    const purchasesMap = useMemo(() => {
        const m = new Map();
        for (const p of purchases) {
            const key = String(p.date || "").slice(0, 10);
            const c = typeof p.count === "number" ? p.count : 1;
            if (key) m.set(key, (m.get(key) || 0) + c);
        }
        return m;
    }, [purchases]);

    const activeMap = mode === "Sold" ? salesMap : purchasesMap;


    const dayKeys = useMemo(() => {
        const keys = [];
        const now = new Date();
        const endUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())); // dziś 00:00Z
        const startUTC = new Date(endUTC);
        startUTC.setUTCDate(endUTC.getUTCDate() - (range - 1));
        for (let d = new Date(startUTC); d <= endUTC; d.setUTCDate(d.getUTCDate() + 1)) {
            keys.push(toYMDUTC(d));
        }
        return keys;
    }, [range]);

    const series = useMemo(() => dayKeys.map((k) => activeMap.get(k) || 0), [dayKeys, activeMap]);


    const W = size.w;
    const H = size.h;
    const P = Math.max(24, Math.min(36, Math.round(W * 0.07)));
    const innerW = W - P - 10;
    const innerH = H - P - 12;

    const maxY = Math.max(1, ...series);
    const niceMax = niceCeil(maxY);
    const yTicks = [0, niceMax * 0.25, niceMax * 0.5, niceMax * 0.75, niceMax];

    const xOf = (i) => P + (i * innerW) / (series.length - 1 || 1);
    const yOf = (v) => P + innerH - (v / (niceMax || 1)) * innerH;

    const dLine = series.map((v, i) => `${i === 0 ? "M" : "L"} ${xOf(i)} ${yOf(v)}`).join(" ");
    const dArea =
        `M ${xOf(0)} ${yOf(0)} ` +
        series.map((v, i) => `L ${xOf(i)} ${yOf(v)}`).join(" ") +
        ` L ${xOf(series.length - 1)} ${yOf(0)} Z`;

    const fs = Math.max(12, Math.min(16, Math.round(W * 0.04)));
    const fsSmall = Math.max(12, Math.min(14, Math.round(W * 0.035)));
    const strokeW = Math.max(2, Math.min(3, Math.round(W * 0.007)));

    const fmtShort = (s) =>
        parseYMD(s).toLocaleDateString(undefined, { month: "2-digit", day: "2-digit" });

    const xLabels = [
        fmtShort(dayKeys[0] || toYMDUTC(new Date())),
        fmtShort(dayKeys[Math.floor((dayKeys.length - 1) / 2)] || toYMDUTC(new Date())),
        fmtShort(dayKeys[dayKeys.length - 1] || toYMDUTC(new Date()))
    ];


    const showTooltip = (e, idx) => {
        if (!wrapRef.current) return;
        const rect = wrapRef.current.getBoundingClientRect();
        setTt({
            show: true,
            x: e.clientX - rect.left + 10,
            y: e.clientY - rect.top - 10,
            date: fmtFull(parseYMD(dayKeys[idx])),
            value: series[idx]
        });
    };
    const hideTooltip = () => setTt((t) => ({ ...t, show: false }));

    return (
        <div className="rp-sold-card">
            <div className="rp-sold-card__head">
                {selectedStat !== 1 ? (
                    <button className="rp-sold-card-btn" onClick={() => setSelectedStat(1)}>Expand</button>
                ) : (
                    <button className="rp-sold-card-btn" onClick={() => setSelectedStat(null)}>Close</button>
                )}
            </div>

            <div className="rp-sold-chart-wrap" ref={wrapRef}>
                <svg className="rp-sold-chart" viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
                    <rect x="0" y="0" width={W} height={H} rx="14" className="rp-chart-bg" />

                    <line x1={P} y1={P} x2={P} y2={P + innerH} className="rp-axis" />
                    <line x1={P} y1={P + innerH} x2={P + innerW} y2={P + innerH} className="rp-axis" />

                    {yTicks.map((t, i) => {
                        const y = yOf(t);
                        return (
                            <g key={i}>
                                <line x1={P} y1={y} x2={P + innerW} y2={y} className="rp-grid" />
                                <text
                                    x={P - 6}
                                    y={y}
                                    className="rp-tick-y"
                                    dominantBaseline="middle"
                                    style={{ fontSize: fsSmall }}
                                >
                                    {Math.round(t)}
                                </text>
                            </g>
                        );
                    })}

                    <path d={dArea} className="rp-area" />
                    <path d={dLine} className="rp-line" style={{ strokeWidth: strokeW }} />

                    {series.map((v, i) =>
                        v > 0 ? (
                            <circle
                                key={i}
                                cx={xOf(i)}
                                cy={yOf(v)}
                                r={strokeW + 1}
                                className="rp-dot"
                                onMouseEnter={(e) => showTooltip(e, i)}
                                onMouseMove={(e) => showTooltip(e, i)}
                                onMouseLeave={hideTooltip}
                            />
                        ) : null
                    )}

                    <text x={P} y={P + innerH + 14} className="rp-tick-x" textAnchor="start" style={{ fontSize: fs }}>
                        {xLabels[0]}
                    </text>
                    <text
                        x={P + innerW / 2}
                        y={P + innerH + 14}
                        className="rp-tick-x"
                        textAnchor="middle"
                        style={{ fontSize: fs }}
                    >
                        {xLabels[1]}
                    </text>
                    <text
                        x={P + innerW}
                        y={P + innerH + 14}
                        className="rp-tick-x"
                        textAnchor="end"
                        style={{ fontSize: fs }}
                    >
                        {xLabels[2]}
                    </text>
                </svg>

                <div className={`chart-tooltip ${tt.show ? "is-visible" : ""}`} style={{ left: tt.x, top: tt.y }}>
                    <div className="chart-tooltip__date">{tt.date}</div>
                    <div className="chart-tooltip__val">
                        {mode}: <strong>{tt.value}</strong>
                    </div>
                </div>
            </div>

            <div className="rp-sold-body">
                <div className="rp-sold-options" role="tablist" aria-label="Mode">
                    {["Purchased", "Sold"].map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            role="tab"
                            aria-selected={mode === opt}
                            className={`seg-btn ${mode === opt ? "is-active" : ""}`}
                            onClick={() => setMode(opt)}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                <div className="rp-sold-card__range">
                    <span className="rp-sold-span">Select date range:</span>
                    <div className="rp-sold-btns">
                        {[30, 60, 90, 360].map((r) => (
                            <button
                                key={r}
                                className={`seg-btn ${range === r ? "is-active" : ""}`}
                                onClick={() => setRange(r)}
                            >
                                {r} days
                            </button>
                        ))}
                    </div>
                </div>
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
