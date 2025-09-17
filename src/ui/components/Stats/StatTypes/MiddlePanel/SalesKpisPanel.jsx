import React, {useEffect, useMemo, useState} from "react";
import './SalesKpisPanel.css'
const tiles = [
    {id:1,name:'Total Profit',key:'total_profit'},
    {id:2,name:'Total Income',key:'total_income'},
    {id:3,name:"Purchases value", key:'purchases_value'}
]
const RANGE = {
    "24h":"24h",
    "7 days":"7d",
    "30 days":"30d",
    "all":"all"

}
const RANGE_KEYS = ["24h", "7 days", "30 days", "all"];
const SalesKpisPanel = ({selectedStat, setSelectedStat,kpisData}) =>{

    const [index,setIndex] = useState(0);
    const [range,setRange] = useState('all')



    const dataByLabel = useMemo(() => {
        if (!kpisData) return {};
        if (Array.isArray(kpisData)) {
            return kpisData.reduce((acc, r) => {
                if (r && r.label) acc[r.label] = r;
                return acc;
            }, {});
        }
        return kpisData;
    }, [kpisData]);


    const activeTile = tiles[index];
    const activeRow = dataByLabel[range] || {};
    const value = Number(activeRow?.[activeTile.key] ?? 0);


    const prev = () => setIndex((i) => Math.max(0, i - 1));
    const next = () => setIndex((i) => Math.min(tiles.length - 1, i + 1));



    return (
        <div className="mp-skp-wrapper">
            <button
                className="mp-skp-arrow mp-skp-arrow--left"
                aria-label="Previous"
                onClick={prev}
                disabled={index === 0}
            >

                ‹
            </button>

            <div className="mp-skp-container">
                <h3 className="mp-skp-title">{activeTile.name}</h3>
                {selectedStat !== 2 ?
                    <button className="mp-skp-card-btn" onClick={()=>setSelectedStat(2)}>Expand</button>
                    :
                    <button className="mp-skp-card-btn" onClick={()=>setSelectedStat(null)}>Close</button>
                }
                <div className="mp-skp-card__range">
                    {RANGE_KEYS.map((label) => {
                        const key = RANGE[label];
                        return (
                            <button
                                key={label}
                                className={`range-btn ${range === key ? "is-active" : ""}`}
                                onClick={() => setRange(key)}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
                <article className="mp-skp-tile is-active">
                    <p
                        className="mp-skp-text"
                        style={{ color: value >= 0 ? "green" : "red" }}
                        title={`${activeTile.key} (${range})`}
                    >
                        {value}
                    </p>
                </article>

            </div>
            <button
                className="mp-skp-arrow mp-skp-arrow--right"
                aria-label="Next"
                onClick={next}
                >
                ›
            </button>

        </div>



    )

}


export default SalesKpisPanel

