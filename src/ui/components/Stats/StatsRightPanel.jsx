import SoldLastDaysChart from "./StatTypes/RightPanel/SoldLastDaysChart";
import './StatsRightPanel.css'
import SalesKpisPanel from "./StatTypes/RightPanel/SalesKpisPanel";
import ListingStatus from "./StatTypes/RightPanel/ListingStatus";





const StatsRightPanel = ({selectedStat,setSelectedStat,sales,purchases,kpisData,listingAmount}) =>{

    return (
        <div className="sr-container">

            {selectedStat === 1 &&
                <div className="sr-stat">
                    <SoldLastDaysChart sales={sales} purchases={purchases} initialRangeDays={30} selectedStat={selectedStat} setSelectedStat={setSelectedStat} height={400}/>
                </div>
            }
            {selectedStat === 2 &&
                <div className="sr-stat">
                    <SalesKpisPanel selectedStat={selectedStat} setSelectedStat={setSelectedStat} kpisData={kpisData} />
                </div>
            }
            {selectedStat === 3 &&
                <div className="sr-stat">
                    <ListingStatus selectedStat={selectedStat} setSelectedStat={setSelectedStat} listingAmount={listingAmount} />
                </div>

            }

        </div>
    )

}

export default StatsRightPanel

