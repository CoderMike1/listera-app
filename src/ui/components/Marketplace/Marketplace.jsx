import Sidebar from "../Sidebar/Sidebar";
import MarketplaceMiddlePanel from "./MarketplaceMiddlePanel";

import './Marketplace.css'
import {useCallback, useEffect, useState} from "react";
import MarketplaceRightPanel from "./MarketplaceRightPanel";

const Marketplace = () =>{

    const [adding,setAdding] = useState(true)

    const [tasks,setTasks] = useState([])

    const [itemsList, setItemsList] = useState([]);
    const [kpisData,setKpisData] = useState('')

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
                setItemsList(itemsRes.value.results || []);
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

    useEffect(()=>{
        const f1 = async()=>{
            const resp = await window.marketplace.api_get_tasks()
            console.log(resp)
            if(!resp.ok){
                throw new Error()
            }
            else{
                setTasks(resp.results)
            }
        }
        f1()
    },[])


     return (
         <div className="marketplace-cols">
             <aside className="panel sidebar-panel">
                 <Sidebar/>
             </aside>
             <div className="panel">
                <MarketplaceMiddlePanel tasks={tasks}/>
             </div>
             <aside className="panel">
                 <MarketplaceRightPanel adding={adding} setAdding={setAdding} items={itemsList}/>
             </aside>
         </div>
     )

}

export default Marketplace