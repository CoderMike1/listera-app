import SoldLastDaysChart from "./StatTypes/RightPanel/SoldLastDaysChart";
import './StatsRightPanel.css'





const StatsRightPanel = ({selectedStat,setSelectedStat,sales,purchases}) =>{

    return (
        <div className="sr-container">

            {selectedStat === 1 &&
                <div className="sr-stat">
                    <SoldLastDaysChart sales={sales} purchases={purchases} initialRangeDays={30} selectedStat={selectedStat} setSelectedStat={setSelectedStat} height={400}/>
                </div>
            }

        </div>
    )

}

export default StatsRightPanel

