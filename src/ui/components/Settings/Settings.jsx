import Sidebar from "../Sidebar/Sidebar";
import './Settings.css'
import SettingsMiddlePanel from "./SettingsMiddlePanel";
const Settings = () =>{

    return (
        <div className='settings-cols'>
            <aside className='panel sidebar-panel'>
                <Sidebar/>
            </aside>
            <div className='panel'>
                <SettingsMiddlePanel/>
            </div>
            <aside className='panel'>

            </aside>
        </div>
    )

}

export default Settings