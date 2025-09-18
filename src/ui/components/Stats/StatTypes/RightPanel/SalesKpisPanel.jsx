import React, {useMemo, useState} from "react";
import './SalesKpisPanel.css'

// const kpisOptions = [
//     {name:'Total Profit',key:'total_profit'},
//     {name:'Total Income',key:'total_income'},
//     {name:"Purchases value", key:'purchases_value'}
// ]

const KPIS_OPTIONS = {
    "Total Profit":"total_profit",
    "Total Income":"total_income",
    "Purchases value":"purchases_value"
}

const RANGE = {
    "24h":"24h",
    "7 days":"7d",
    "30 days":"30d",
    "all":"all"

}

const SalesKpisPanel = ({selectedStat,setSelectedStat,kpisData}) =>{

    const [mode,setMode] = useState("total_profit")
    const [dateRange,setDateRange] = useState("24h")

    const current_kpi_value = useMemo(()=>{
        // console.log(mode)
        // console.log(dateRange)
        if(!kpisData) return {};

        const row = kpisData.find(r => r.label === dateRange);
        return row ? row[mode] : undefined;
    },[kpisData, dateRange, mode])



    return (

        <div className="rp-skp-container">
            <div className="rp-skp__head">
                {selectedStat !== 2 ? (
                    <button className="rp-skp-btn" onClick={() => setSelectedStat(2)}>Expand</button>
                ) : (
                    <button className="rp-skp-btn" onClick={() => setSelectedStat(null)}>Close</button>
                )}
            </div>
            <div className="rp-skp-body">

                <div className="rp-skp-tile is-active">
                    <p
                        className="rp-skp-text"
                        style={{ color: current_kpi_value >= 0 ? "green" : "red" }}
                        title="s"
                    >
                        {current_kpi_value}
                    </p>
                </div>

                <div className="rp-skp-options">
                    {Object.entries(KPIS_OPTIONS).map(([key,value])=>(
                        <button
                            key={value}
                            type="button"
                            className={`skp-btn ${mode === value ? "is-active" : ""}`}
                            onClick={() => setMode(value)}
                        >
                            {key}
                        </button>
                    ))}

                </div>

                <div className="rp-skp-date-range-options">
                    <span className="rp-skp-span">Select date range:</span>
                    <div className="rp-skp-btns">
                        {Object.entries(RANGE).map(([key, value]) => (
                            <button
                                key={value}
                                type="button"
                                className={`skp-btn ${dateRange === value ? "is-active" : ""}`}
                                onClick={() => setDateRange(value)}
                            >
                                {key}
                            </button>
                        ))}
                    </div>

                </div>
            </div>




        </div>


    )

}

export default SalesKpisPanel
