import './Dashboard.css'
import Sidebar from "../Sidebar/Sidebar";
import Overview from "./Overview";
import NotificationPanel from "./NotificationPanel";

const Dashboard = () =>{

    return(
        <div className='dash-cols'>
            <aside className='panel sidebar-panel'>
                <Sidebar/>
            </aside>
            <div className='panel'>
                <Overview/>
            </div>
            <aside className='panel'>
                <NotificationPanel/>
            </aside>
        </div>
    )


}

export default Dashboard