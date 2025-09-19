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
    const [listingAmount,setListingAmount] = useState([])
    const [agedInventory,setAgedInventory] = useState([])

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

        const f4 = async() =>{
            const resp = await window.stats.api_get_listings_amount();
            if(!resp.ok){
                throw new Error("jakis error siema")
            }
            else{
                setListingAmount(resp.results)
            }
        }
        const f5 = async()=>{
            const resp = await window.stats.api_get_aged_inventory();
            if(!resp.ok){
                throw new Error()
            }
            else{
                setAgedInventory(resp.results)
            }

        }


        f()
        f2()
        f3()
        f4()
        f5()
    },[selectedStat])
    return (

        <div className="stats-cols">
            <aside className='panel sidebar-panel'>
                <Sidebar/>
            </aside>
            <div className='panel'>
                <StatsMiddlePanel selectedStat={selectedStat} setSelectedStat={setSelectedStat} sales={salesCount} kpisData={kpisData} listingAmount={listingAmount} agedInventory={agedInventory}/>
            </div>
            <aside className='panel'>
               <StatsRightPanel selectedStat={selectedStat} setSelectedStat={setSelectedStat} sales={salesCount} purchases={purchasesCount} kpisData={kpisData} listingAmount={listingAmount} />
            </aside>

        </div>


    )

}


export default Stats