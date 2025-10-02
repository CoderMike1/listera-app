import Sidebar from "../Sidebar/Sidebar";
import MarketplaceMiddlePanel from "./MarketplaceMiddlePanel";

import './Marketplace.css'
import {useCallback, useEffect, useState} from "react";
import MarketplaceRightPanel from "./MarketplaceRightPanel";

const Marketplace = () =>{

    const [itemsStatus,setItemsStatus] = useState([]);
    const [running,setRunning] = useState(null);
    const [marketplacesStatuses,setMarketplacesStatuses] = useState([]);

    const [itemsList, setItemsList] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const [runningCount,setRunningCount] = useState(0)
    const [errorCount,setErrorCount] = useState(0);


    const [selectedItem,setSelectedItem] = useState(null)
    const onSelect = useCallback((item) => setSelectedItem(item), []);




    const load = useCallback(async () => {
        try {
            const [ itemsRes] = await Promise.allSettled([
                window.items.api_get_all_items(),
            ])
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




    const checkMarketplace = async () =>{
        const tasks = await window.marketplace.api_get_tasks()
        const byId = {}

        for(const t of tasks.results){
            if(!byId[t.id]) byId[t.id] = {};

            byId[t.id][t.site]  = {status:t.status,listingPayout:t.payout_price,listingPrice:t.listing_price,listing_id:t?.listing_id}

        }

        const nextItemsStatus = {}

        for(const it of itemsList){
            const id = String(it.id);
            const any = tasks.results.find(r => String(r.id) === id);
            if(id === String(running)){
                nextItemsStatus[id] = 'running'
            }
            else{
                nextItemsStatus[id] = (any?.status ?? 'unlisted');
            }

        }

        setMarketplacesStatuses(byId);

        setItemsStatus(prev => ({ ...prev, ...nextItemsStatus }));

    }
    const setRun = (flag,id) => {

        setRunningCount(prev => {
            const next = flag === "running" ? prev + 1 : Math.max(0,prev-1);
            return next;
        })

        setErrorCount(prev =>{
            const next = flag === "error" ? prev+1 : prev;
            return  next;
        })
        if(flag==='running'){
            setRunning(id)
        }
        else{
            setRunning(null)
        }

    }


    useEffect(()=>{


        const f = async ()=>{
            await checkMarketplace()
        }
        f()

    },[itemsList,runningCount])


     return (
         <div className="marketplace-cols">
             <aside className="panel sidebar-panel">
                 <Sidebar/>
             </aside>
             <div className="panel">
                <MarketplaceMiddlePanel tasks={itemsList} onSelect={onSelect} selectedItem={selectedItem} itemsStatus={itemsStatus} runningCount={runningCount} errorCount={errorCount}/>
             </div>
             <aside className="panel">
                 <MarketplaceRightPanel items={itemsList} selectedItem={selectedItem} onClose={()=>setSelectedItem(null)} setRun={setRun} marketplacesStatuses={marketplacesStatuses} running={running}/>
             </aside>
         </div>
     )

}

export default Marketplace