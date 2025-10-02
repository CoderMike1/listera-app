import SearchBar from "../Dashboard/SearchBar";
import './MarketplaceMiddlePanel.css'
import ReactPaginate from "react-paginate";
import {useMemo, useState} from "react";



const MarketplaceMiddlePanel = ({tasks,onSelect,selectedItem,itemsStatus,runningCount,errorCount}) =>{

    //task kpis section
    const taskKpis = [
        {label:"All Tasks",value:tasks.length || 0, icon:"📋"},
        {label:"Running Tasks",value:runningCount,icon:"▶️️"},
        {label:"Errors",value:errorCount,icon:"🚨"}
    ]

    //pagination section
    const itemsPerPage = 5;
    const [pageNumber,setPageNumber] = useState(0);
    const itemsVisited = itemsPerPage*pageNumber;
    const pageCount = Math.ceil(tasks.length/itemsPerPage)
    const pageSlice = tasks.slice(itemsVisited, itemsVisited + itemsPerPage);



    return (
        <div className="mmp-container">
            <div className="mmp-top-headers">
                <SearchBar placeholder="Search by task name..."/>

            </div>

            <div className="mmp-kpis">
                {taskKpis.map((k)=>(
                    <div className="mmp-card" key={k.label}>
                        <div className="mmp-card-icon">{k.icon}</div>
                        <div className="mmp-card-main">
                            <div className="mmp-card-value">{k.value}</div>
                            <div className="mmp-card-label">{k.label}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mmp-toolbar">
                <div className="mmp-chips">
                    {/*<button className="mmp-chips-btn">Run</button>*/}
                    {/*<button className="mmp-chips-btn">Stop</button>*/}
                    {/*<button className="mmp-chips-btn">Delete</button>*/}
                    <button className="mmp-chips-btn" onClick={()=>reload()}>Refresh</button>
                </div>
            </div>

            <div className="mmp-table-wrap" lang="en">
                <table className="mmp-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>SKU</th>
                            <th>Size</th>
                            <th>Stock</th>
                            <th>Active Market&shy;places</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {pageSlice && pageSlice.length > 0 ?(
                            pageSlice.map((t) =>(
                            <tr key={t.name} onClick={()=>onSelect(t)}>
                                <td>
                                    <img src={t.image} height={50} alt={t.name}/>
                                </td>
                                <td className="mmp-cell-name">
                                    <span className="mmp-cell-name-strong">{t.name}</span>
                                </td>
                                <td>{t.sku}</td>
                                <td>{t.size}</td>
                                <td>{t.stock}</td>
                                <td>{itemsStatus[t.id] === 'listed' ? 'HypeBoost' : ""}</td>
                                <td>{itemsStatus[t.id]}</td>
                                {/*<td className="mmp-td-action-buttons">*/}
                                {/*    <button title="Run" className="mmp-action-btn run" onClick={()=>runTask(t)}>▶️</button>*/}
                                {/*    <button title="Edit" className="mmp-action-btn edit" onClick={()=>editTask(t)}>✏️</button>*/}
                                {/*    <button title="Stop" className="mmp-action-btn stop" onClick={()=>stopTask(t)}>⏹️</button>*/}
                                {/*    <button title="Delete" className="mmp-action-btn delete" onClick={()=>deleteTask(t.id)}>🗑️</button>*/}
                                {/*</td>*/}
                            </tr>
                        ))
                    )
                        :
                        <tr>
                            <td colSpan={8} className="mmp-table-empty">no items found...</td>
                        </tr>
                    }
                    </tbody>

                </table>

                {pageSlice && pageSlice.length >0 ?

                    <ReactPaginate
                        pageCount={pageCount}
                        onPageChange={({selected}) => setPageNumber(selected)}
                        containerClassName={"paginationBttns"}
                        previousLinkClassName={"previousBttn"}
                        nextLinkClassName={"nextBttn"}
                        disabledClassName={"paginactionDisabled"}
                        activeClassName={"paginationActive"}
                    />
                    :
                    <></>



                }



            </div>




        </div>
    )

}
export default MarketplaceMiddlePanel