
import './ListingStatus.css'
import React from "react";

const ListingStatus = ({selectedStat,setSelectedStat,listingAmount}) =>{

    const active = 22
    console.log(listingAmount)
    const parts = [
        {"label":"Active","key":"active",value:listingAmount['active']},
        {"label":"Sold","key":"sold",value:listingAmount['sold']},
        {"label":"To Ship","key":"toship",value:listingAmount['toship']}
    ]


    const r = 15.915;
    const c = 2 * Math.PI * r;
    const arc = (active / 100) * c;
    const cx = 18, cy = 18;
    const labelR = 11;

    const start = -Math.PI / 2;

    const total = Math.max(1, parts.reduce((s, p) => s + (p.value || 0), 0));

    let offsetLen = 0;
    let accFrac = 0;


    return (
        <div className="mp-ls-container">
            <h3 className="mp-ls-title">Listing Status</h3>
            {selectedStat !== 3 ?
                <button className="mp-ls-card-btn" onClick={()=>setSelectedStat(3)}>Expand</button>
                :
                <button className="mp-ls-card-btn" onClick={()=>setSelectedStat(null)}>Close</button>
            }
            <div className="mp-ls-body">
                <svg className="mp-ls-chart mp-ls-chart--donut" viewBox="0 0 36 36" aria-hidden="true">
                    <circle className="mp-ls-donut__track" cx={cx} cy={cy} r={r} />
                    {parts.map((p) =>{
                        const frac = (p.value || 0) / total;
                        const len = c *frac;
                        const dasharray = `${len} ${c-len}`;
                        const dashoffset = -offsetLen;

                        offsetLen += len;
                        return (
                            <circle
                                key={p.key}
                                className={`mp-ls-donut__value mp-ls-donut__value--${p.key}`}
                                cx={cx} cy={cy} r={r}
                                strokeDasharray={dasharray}
                                strokeDashoffset={dashoffset}
                                transform={`rotate(-90 ${cx} ${cy})`}
                            />
                        )


                    })}


                    <g className="mp-ls-donut__labels" fontSize="3" fontWeight="600">

                        {parts.map((p) =>{
                            const frac = (p.value || 0) / total;
                            const mid  = accFrac + frac / 2;
                            const theta = start + mid * 2 * Math.PI;
                            const x = cx + labelR * Math.cos(theta);
                            const y = cy + labelR * Math.sin(theta);
                            accFrac += frac;

                            const pct = Math.round(frac * 100);
                            return (
                                <text
                                    key={`label-${p.key}`}
                                    className="mp-ls-donut_text"
                                    x={x}
                                    y={y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {pct}%
                                </text>
                            );
                        })}
                    </g>
                </svg>
                <div className="mp-ls-legend">
                    <div className="mp-ls-legend-dot-part">
                        <span className="mp-ls-dot mp-ls-dot--active"/>
                        <span>Active</span>
                    </div>
                    <div className="mp-ls-legend-dot-part">
                        <span className="mp-ls-dot mp-ls-dot--toship" />
                        <span>To Ship</span>
                    </div>
                    <div className="mp-ls-legend-dot-part">
                        <span className="mp-ls-dot mp-ls-dot--sold" />
                        <span>Sold</span>
                    </div>
                </div>
            </div>

        </div>
    );

}

export default ListingStatus

