import './Dashboard.css'
import Sidebar from "../Sidebar/Sidebar";
import Overview from "./Overview";

const Dashboard = () =>{

    return(
        <div className='dash-cols'>
            <aside className='panel'>
                <Sidebar/>
            </aside>
            <div className='panel'>
                <Overview/>
            </div>
            <aside className='panel'>Right panel</aside>
        </div>
    )


}

export default Dashboard