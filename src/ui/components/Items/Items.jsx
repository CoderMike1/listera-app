import Sidebar from "../Sidebar/Sidebar";
import './Items.css'
import ItemsMiddlePanel from "./ItemsMiddlePanel";

const Items = () =>{

    return (
        <div className='items-cols'>
            <aside className='panel sidebar-panel'>
                <Sidebar/>
            </aside>
            <div className='panel'>
                <ItemsMiddlePanel/>
            </div>
            <aside className='panel'>
                left panel
            </aside>
        </div>
    )

}


export default Items