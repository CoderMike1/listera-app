import './StatsMiddlePanel.css'
import SoldLastDaysChart from "./StatTypes/MiddlePanel/SoldLastDaysChart";
import SalesKpisPanel from "./StatTypes/MiddlePanel/SalesKpisPanel";
import ListingStatus from "./StatTypes/MiddlePanel/ListingStatus";
import AgedInventoryStat from "./StatTypes/MiddlePanel/AgedInventoryStat";
import {useMemo} from "react";




const StatsMiddlePanel = ({selectedStat,setSelectedStat, sales,kpisData,listingAmount,agedInventory}) =>{



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
                    <ListingStatus selectedStat={selectedStat} setSelectedStat={setSelectedStat} listingAmount={listingAmount}/>
                </div>
                <div className="sm-item">
                    <AgedInventoryStat selectedStat={selectedStat} setSelectedStat={setSelectedStat} agedInventory={agedInventory.slice(0,2) || []}/>
                </div>
                <div className="sm-item">
                    {/*najlepiej sprzedajace sie buty, najwiekszy profit*/}
                    SOON
                </div>
                <div className="sm-item">
                    {/*informacje dotyczace tego obecnego miesiaca*/}
                    SOON
                </div>


            </div>



        </div>

    )

}

export default StatsMiddlePanel

