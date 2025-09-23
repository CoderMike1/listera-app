import SearchBar from "../Dashboard/SearchBar";
import './MarketplaceMiddlePanel.css'
import dunkPNG from '../../assets/dunk1.png'
const taskKpis = [
        {label:"all_task",value: 10,icon:"🏭"},
    {label:"running",value:3,icon:"🔥"},
    {label:"errors",value:2,icon:"📦️"}
]



const MarketplaceMiddlePanel = ({tasks}) =>{
    console.log(tasks)
    return (
        <div className="mmp-container">
            <div className="mmp-top-headers">
                <SearchBar placeholder="Search by task name..."/>
                <button className="btn-add" onClick={()=>{}}>
                    <span className="btn-add-span">+</span>
                    Add Task
                </button>
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
                    <button className="mmp-chips-btn">Run</button>
                    <button className="mmp-chips-btn">Stop</button>
                    <button className="mmp-chips-btn">Delete</button>
                    <button className="mmp-chips-btn">Refresh</button>
                </div>
            </div>

            <div className="mmp-table-wrap">
                <table className="mmp-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>SKU</th>
                            <th>Size</th>
                            <th>Payout Price</th>
                            <th>Marketplaces</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {tasks && tasks.length > 0 ?(
                        tasks.map((t) =>(
                            <tr>
                                <td>
                                    <img src={dunkPNG} width={50} height={50} alt={t.name}/>
                                </td>
                                <td className="mmp-cell-name">
                                    <span className="mmp-cell-name-strong">{t.name}</span>
                                </td>
                                <td>{t.sku}</td>
                                <td>{t.size}</td>
                                <td>{t.payout_price}</td>
                                <td>Stockx</td>
                                <td>Running</td>
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
            </div>


        </div>
    )

}
export default MarketplaceMiddlePanel