import Sidebar from "../Sidebar/Sidebar";
import MarketplaceMiddlePanel from "./MarketplaceMiddlePanel";

import './Marketplace.css'

const Marketplace = () =>{

     return (
         <div className="marketplace-cols">
             <aside className="panel sidebar-panel">
                 <Sidebar/>
             </aside>
             <div className="panel">
                <MarketplaceMiddlePanel/>
             </div>
             <aside className="panel">
                 right panel
             </aside>
         </div>
     )

}

export default Marketplace