import React from "react";
import './AgedInventoryStat.css'
import dunkPNG from '../../../../assets/dunk1.png'

const AgedInventoryStat = ({selectedStat,setSelectedStat,agedInventory}) =>{
    console.log(agedInventory)
    // const agedInventory1 = [
    //     {id:1,image:dunkPNG,name:"Jordan 1 Low",sku:"abcdhs",size:"36",stock:1,days:33},
    //     {id:2,image:dunkPNG,name:"Dunk Low Panda",sku:"abcdhs",size:"43 1/3",stock:3,days:3},
    //     // {id:3,image:dunkPNG,name:"Jordan 1 High Taxi AVCD783",sku:"abcdhs",size:"45.5",stock:2,days:11},
    //     // {id:4,image:dunkPNG,name:"Jordan 1 Low",sku:"abcdhs",size:"39",stock:1,days:21},
    //     // {id:5,image:dunkPNG,name:"Jordan 1 Low",sku:"abcdhs",size:"37",stock:1,days:5}
    //
    // ]

    const maxDays = 2 * agedInventory[0]?.days  || 0

    return (
        <div className="mp-ais-container">
            {selectedStat !== 4 ?
                <button className="mp-ais-card-btn" onClick={()=>setSelectedStat(4)}>Expand</button>
                :
                <button className="mp-ais-card-btn" onClick={()=>setSelectedStat(null)}>Close</button>
            }
            <header className="mp-ais-header">
                <div className="mp-ais-header-div">
                    <h3 className="mp-ais-title">Aged Inventory - Top 5</h3>
                    <p className="mp-ais-p-title">days in stock</p>

                </div>
            </header>
            <ol className="mp-ais-items-list" role="list">
                {agedInventory.map((item,idx) =>{
                    const pct = Math.round((item.days / maxDays) * 100);

                    const color = ["#e11d48", "#06b6d4", "#10b981", "#a855f7", "#f59e0b"][idx % 5]

                    return (
                        <li className="mp-ais-item" role="listitem" key={idx}>
                            <div className="mp-ais-item-avatar" aria-hidden="true">
                                <img src={dunkPNG} width={50} height={50}/>
                            </div>
                            <div className="mp-ais-item-body">
                                <div className="mp-ais-item-body-name">{item.name}</div>
                                <div className="mp-ais-item-body-desc">
                                    <div className="mp-ais-item-body-sku">{item.sku}</div>
                                    <>&nbsp;|&nbsp;</>
                                    <div className="mp-ais-item-body-size">{item.size}</div>
                                </div>
                                <div
                                    className="mp-ais-bar"
                                    style={{
                                        ['--bar-w']: `${pct}%`,
                                        ['--bar-color']: color,
                                    }}
                                    aria-label={`In stock ${item.days} days`}
                                >
                                    <span className="mp-ais-bar-badge">{item.days} days</span>
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