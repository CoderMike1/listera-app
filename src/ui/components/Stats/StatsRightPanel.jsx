import SoldLastDaysChart from "./StatTypes/RightPanel/SoldLastDaysChart";
import './StatsRightPanel.css'

const sales = [
    { date: "2025-08-16" },
    { date: "2025-08-28", count: 20 },
    { date: "2025-08-29", count: 100 },
    { date: "2025-09-03", count: 8 },
];

const purchases = [
    { date: "2025-06-21" ,count: 9},
    { date: "2025-03-28", count: 5 },
    { date: "2025-05-29", count: 15 },
    { date: "2025-09-03", count: 33 },
];



const StatsRightPanel = ({selectedStat,setSelectedStat}) =>{

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

