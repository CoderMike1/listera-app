import React, {useState} from "react";
import './ListingStatus.css'

const ListingStatus = ({selectedStat,setSelectedStat,listingAmount}) =>{

    const [checked,setChecked] = useState(false);


    const parts_v1 = [
        {"label":"Active","key":"active",value:listingAmount['active']},
        {"label":"Sold","key":"sold",value:listingAmount['sold']},
        {"label":"To Ship","key":"toship",value:listingAmount['toship']}
    ]
    const parts_v2 = [
        {"label":"Active","key":"active",value:listingAmount['active']},
        {"label":"Sold","key":"sold",value:(listingAmount['sold']+listingAmount['toship'])},
        // {"label":"To Ship","key":"toship",value:listingAmount['toship']}
    ]
    const [currentListingParts,setCurrentListingParts] = useState(parts_v1)


    const r = 15.915;
    const c = 2 * Math.PI * r;
    const cx = 18, cy = 18;
    const labelR = 10;

    const start = -Math.PI / 2;

    const total = Math.max(1, currentListingParts.reduce((s, p) => s + (p.value || 0), 0));

    let offsetLen = 0;
    let accFrac = 0;


    const handleChange = (e) =>{
        const isChecked = e.target.checked;
        setChecked(isChecked);

        if (isChecked) {
            setCurrentListingParts(parts_v2)
        } else {
            setCurrentListingParts(parts_v1)
        }
    }



    return (

        <div className="rp-ls-container">
            <div className="rp-ls__head">
                {selectedStat !== 3 ? (
                    <button className="rp-ls-btn" onClick={() => setSelectedStat(3)}>Expand</button>
                ) : (
                    <button className="rp-ls-btn" onClick={() => setSelectedStat(null)}>Close</button>
                )}
            </div>


            <div className="rp-ls-body">
                <svg className="rp-ls-chart rp-ls-chart--donut" viewBox="0 0 36 36" aria-hidden="true">
                    <circle className="rp-ls-donut__track" cx={cx} cy={cy} r={r} />
                    {currentListingParts.map((p) =>{
                        const frac = (p.value || 0) / total;
                        const len = c *frac;
                        const dasharray = `${len} ${c-len}`;
                        const dashoffset = -offsetLen;

                        offsetLen += len;
                        return (
                            <circle
                                key={p.key}
                                className={`rp-ls-donut__value rp-ls-donut__value--${p.key}`}
                                cx={cx} cy={cy} r={r}
                                strokeDasharray={dasharray}
                                strokeDashoffset={dashoffset}
                                transform={`rotate(-90 ${cx} ${cy})`}
                            />
                        )


                    })}


                    <g className="rp-ls-donut__labels" fontSize="3" fontWeight="600">

                        {currentListingParts.map((p) =>{
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
                                    className="rp-ls-donut_text"
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
                <div className="rp-ls-legend">
                    <div className="rp-ls-legend-dot-part">
                        <span className="rp-ls-dot rp-ls-dot--active"/>
                        <span>Active</span>
                    </div>
                    <div className="rp-ls-legend-dot-part">
                        <span className="rp-ls-dot rp-ls-dot--toship" />
                        <span>To Ship</span>
                    </div>
                    <div className="rp-ls-legend-dot-part">
                        <span className="rp-ls-dot rp-ls-dot--sold" />
                        <span>Sold</span>
                    </div>
                </div>

                <div className="rp-ls-options">
                    <span className="rp-ls-span">Select option:</span>
                    <div className="rp-ls-option">
                        <label className="rp-ls-switch">
                            <input
                                id="toggle-to-ship-as-sold"
                                type="checkbox"
                                checked={checked}
                                onChange={handleChange}
                                role="switch"
                                aria-checked={checked}
                            />
                            <span className="rp-ls-switch__slider" aria-hidden="true" />
                            <span className="rp-ls-switch__label">Group ‘To Ship’ as ‘Sold’</span>
                        </label>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default ListingStatus