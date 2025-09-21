import dunkPNG from '../../../../assets/dunk1.png'
import React from "react";
import './AgedInventoryStat.css'
const AgedInventoryStat = ({selectedStat,setSelectedStat,agedInventory}) =>{

    const maxDays = 2* agedInventory[0]?.days || 0


    return (
        <div className="rp-ais-container">
            <div className="rp-ais-head">
                {selectedStat !== 4 ? (
                    <button className="rp-ais-btn" onClick={() => setSelectedStat(4)}>Expand</button>
                ) : (
                    <button className="rp-ais-btn" onClick={() => setSelectedStat(null)}>Close</button>
                )}
            </div>

            <ol className="rp-ais-items-list" role="list">
                {agedInventory.map((item,idx) =>{
                    const pct = Math.round((item.days / maxDays) * 100);

                    const color = ["#e11d48", "#06b6d4", "#10b981", "#a855f7", "#f59e0b"][idx % 5]

                    return (
                        <li className="rp-ais-item" role="listitem" key={idx}>
                            <div className="rp-ais-item-avatar" aria-hidden="true">
                                <img src={dunkPNG} width={50} height={50}/>
                            </div>
                            <div className="rp-ais-item-body">
                                <div className="rp-ais-item-body-name">{item.name}</div>
                                <div className="rp-ais-item-body-desc">
                                    <div className="rp-ais-item-body-sku">{item.sku}</div>
                                    <>&nbsp;|&nbsp;</>
                                    <div className="rp-ais-item-body-size">{item.size}</div>
                                </div>
                                <div
                                    className="rp-ais-bar"
                                    style={{
                                        ['--bar-w']: `${pct}%`,
                                        ['--bar-color']: color,
                                    }}
                                    aria-label={`In stock ${item.days} days`}
                                >
                                    <span className="rp-ais-bar-badge">{item.days} days</span>
                                </div>

                            </div>

                        </li>
                    )

                })}


            </ol>

        </div>
    )
}

export default AgedInventoryStat