import './StatsMiddlePanel.css'
import SoldLastDaysChart from "./StatTypes/MiddlePanel/SoldLastDaysChart";

const sales = [
    { date: "2025-08-16" },
    { date: "2025-08-28", count: 20 },
    { date: "2025-08-29", count: 100 },
    { date: "2025-09-03", count: 8 },
];


const StatsMiddlePanel = ({selectedStat,setSelectedStat}) =>{

    return (

        <div className="sm-container">
            <div className="sm-container-header">
                <h1>Let's check the data!</h1>
            </div>


            <div className="sm-grid">

                <div className="sm-item">
                    <SoldLastDaysChart sales={sales} initialRangeDays={30} selectedStat={selectedStat} setSelectedStat={setSelectedStat} height={230} />
                </div>
                <div className="sm-item">
                    #2
                </div>
                <div className="sm-item">
                    #3
                </div>
                <div className="sm-item">
                    #4
                </div>
                <div className="sm-item">
                    #5
                </div>
                <div className="sm-item">
                    #6
                </div>
                <div className="sm-item">
                    #7
                </div>
                <div className="sm-item">
                    #8
                </div>


            </div>



        </div>

    )

}

export default StatsMiddlePanel

