import './StatsMiddlePanel.css'
import SoldLastDaysChart from "./StatTypes/MiddlePanel/SoldLastDaysChart";
import SalesKpisPanel from "./StatTypes/MiddlePanel/SalesKpisPanel";




const StatsMiddlePanel = ({selectedStat,setSelectedStat, sales,kpisData}) =>{

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
                    <SalesKpisPanel selectedStat={selectedStat} setSelectedStat={setSelectedStat} kpisData={kpisData} />
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

