import Sidebar from "../Sidebar/Sidebar";
import './Stats.css'
import StatsMiddlePanel from "./StatsMiddlePanel";
import {useEffect, useState} from "react";
import StatsRightPanel from "./StatsRightPanel";

const Stats = () =>{

    const [selectedStat,setSelectedStat] = useState(null);
    const [salesCount, setSalesCount] = useState([])
    const [purchasesCount,setPurchasesCount] = useState([])
    const [kpisData,setKpisData] = useState([])

    useEffect (() =>{
        const f = async ()=>{
            const resp = await window.stats.api_get_sales()
            if(!resp.ok){
                throw new Error("jakis error siema")
            }
            else{
                setSalesCount(resp.results)
            }
        }
        const f2 = async ()=>{
            const resp = await window.stats.api_get_purchases()
            if(!resp.ok){
                throw new Error("jakis error siema")
            }
            else{
                console.log(resp.results)
                setPurchasesCount(resp.results)
            }
        }
        const f3 = async() =>{
            const resp = await window.stats.api_get_kpis_data()
            if(!resp.ok){
                throw new Error("jakis error siema")
            }
            else{
                setKpisData(resp.results)
            }
        }

        f()
        f2()
        f3()
    },[selectedStat])


    return (

        <div className="stats-cols">
            <aside className='panel sidebar-panel'>
                <Sidebar/>
            </aside>
            <div className='panel'>
                <StatsMiddlePanel selectedStat={selectedStat} setSelectedStat={setSelectedStat} sales={salesCount} kpisData={kpisData} />
            </div>
            <aside className='panel'>
               <StatsRightPanel selectedStat={selectedStat} setSelectedStat={setSelectedStat} sales={salesCount} purchases={purchasesCount} kpisData={kpisData} />
            </aside>

        </div>


    )

}


export default Stats