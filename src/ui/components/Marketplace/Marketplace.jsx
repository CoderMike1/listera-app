import Sidebar from "../Sidebar/Sidebar";
import MarketplaceMiddlePanel from "./MarketplaceMiddlePanel";

import './Marketplace.css'
import {useCallback, useEffect, useState} from "react";
import MarketplaceRightPanel from "./MarketplaceRightPanel";

const Marketplace = () =>{


    const [tasks,setTasks] = useState([])

    const [itemsList, setItemsList] = useState([]);
    const [kpisData,setKpisData] = useState('')

    const [selectedItem,setSelectedItem] = useState(null)
    const onSelect = useCallback((item) => setSelectedItem(item), []);

    const load = useCallback(async () => {
        try {
            const [kpisRes, itemsRes] = await Promise.allSettled([
                window.items.api_get_kpis_data(),
                window.items.api_get_all_items(),
            ]);
            if (kpisRes.status === "fulfilled" && kpisRes.value?.ok) {
                setKpisData(kpisRes.value.results);
            } else {
                console.error("kpis error", kpisRes);
            }

            if (itemsRes.status === "fulfilled" && itemsRes.value?.ok) {
                setItemsList(itemsRes.value.results.filter(x => x.status === "active"));
            } else {
                console.error("items error", itemsRes);
            }
        } catch (e) {
            console.error(e);
        } finally {
        }
    }, []);

    useEffect(() => {
        let alive = true;
        (async () => {
            await load();
            if (!alive) return;
        })();
        return () => { alive = false; };
    }, [load]);



     return (
         <div className="marketplace-cols">
             <aside className="panel sidebar-panel">
                 <Sidebar/>
             </aside>
             <div className="panel">
                <MarketplaceMiddlePanel tasks={itemsList} onSelect={onSelect} selectedItem={selectedItem}/>
             </div>
             <aside className="panel">
                 <MarketplaceRightPanel items={itemsList} selectedItem={selectedItem} onClose={()=>setSelectedItem(null)}/>
             </aside>
         </div>
     )

}

export default Marketplace