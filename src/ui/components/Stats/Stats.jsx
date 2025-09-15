import Sidebar from "../Sidebar/Sidebar";
import './Stats.css'
import StatsMiddlePanel from "./StatsMiddlePanel";
import {useState} from "react";
import StatsRightPanel from "./StatsRightPanel";

const Stats = () =>{

    const [selectedStat,setSelectedStat] = useState(null);




    return (

        <div className="stats-cols">
            <aside className='panel sidebar-panel'>
                <Sidebar/>
            </aside>
            <div className='panel'>
                <StatsMiddlePanel selectedStat={selectedStat} setSelectedStat={setSelectedStat} />
            </div>
            <aside className='panel'>
               <StatsRightPanel selectedStat={selectedStat} setSelectedStat={setSelectedStat} />
            </aside>

        </div>


    )

}


export default Stats