import React, {useRef} from "react";
import './AgedInventoryStat.css'

const AgedInventoryStat = ({selectedStat,setSelectedStat,agedInventory}) =>{


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
                                <img src={item.image}  height={50} alt={item.name}/>
                            </div>
                            <div className="mp-ais-item-body">
                                <ACT>{item.name}</ACT>
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


import { useLayoutEffect } from "react";


function ACT({children})
{
    const ref = useRef(null);
    useFitText(ref, {max:13,min:4,lines:2});

    return <div className="mp-ais-item-body-name" ref={ref}>{children}</div>
}
function useFitText(ref, { max = 15, min = 8, lines = 2, step = 0.25 } = {}) {
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const fit = () => {
            el.style.whiteSpace = "normal";
            el.style.overflow = "hidden";
            el.style.display = "block";
            el.style.lineHeight = "1.15";

            let lo = min, hi = max, best = min;
            const lineFactor = 1.15;

            while (hi - lo > step) {
                const mid = (lo + hi) / 2;
                el.style.fontSize = `${mid}px`;
                el.style.maxHeight = `${lines * mid * lineFactor}px`;

                const tooWide = el.scrollWidth > el.clientWidth;
                const tooTall = el.scrollHeight > el.clientHeight;
                if (tooWide || tooTall) {
                    hi = mid;
                } else {
                    best = mid;
                    lo = mid;
                }
            }
            el.style.fontSize = `${best}px`;
            el.style.maxHeight = `${lines * best * lineFactor}px`;
        };

        const id = requestAnimationFrame(fit);

        const ro = new ResizeObserver(fit);
        ro.observe(el);
        el.parentElement && ro.observe(el.parentElement);

        const mo = new MutationObserver(fit);
        mo.observe(el, { characterData: true, subtree: true, childList: true });

        return () => { cancelAnimationFrame(id); ro.disconnect(); mo.disconnect(); };
    }, [ref, max, min, lines, step]);
}
