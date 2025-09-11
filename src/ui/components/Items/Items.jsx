import Sidebar from "../Sidebar/Sidebar";
import './Items.css'
import ItemsMiddlePanel from "./ItemsMiddlePanel";
import ItemsRightPanel from "./ItemsRightPanel";
import {useCallback, useEffect, useMemo, useState} from "react";




const Items = () =>{

    const [kpisData, setKpisData] = useState([]);
    const [itemsList, setItemsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving,setSaving] = useState(false);
    const [err, setErr] = useState(null);

    const[adding,setAdding] = useState(false)

    const [selectedItem,setSelectedItem] = useState(null)
    const onSelect = useCallback((item) => setSelectedItem(item), []);
    const load = useCallback(async () => {
        setLoading(true);
        setErr(null);
        try {
            const [kpisRes, itemsRes] = await Promise.allSettled([
                window.items.api_get_kpis_data(),
                window.items.api_get_all_items(),
            ]);
            console.log(kpisRes)
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
            setErr(e);
            console.error(e);
        } finally {
            setLoading(false);
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

    const selectedItemM = useMemo(
        () => itemsList.find(r => r.id === selectedItem?.id) || null,
        [itemsList, selectedItem]
    );

    const onSave = useCallback(async (draft) =>{
        if(saving) return;
        setSaving(true);



        try{

            const payload = {
                id: draft.id,
                name:draft.name?.trim() ?? "",
                sku:draft.sku?.trim() ?? "",
                size: draft.size ?? "onesize",
                stock: draft.stock === "" || draft.stock == null ? 9: Number(draft.stock),
                purchase_price: draft.purchase_price === "" || draft.purchase_price == null ? 0 :Number(draft.purchase_price)
            }

            const res = payload.id ? await window.items.api_update_item(payload) : await window.items.api_add_item(payload)
            if(!res?.ok){
                throw new Error("update failed")
            }
            else{
                await load()
                setSelectedItem(null)
                setAdding(false)
            }
        }
        catch(e){
            console.error(e)
        }
        finally {
            setSaving(false)
        }

    })


    return (
        <div className='items-cols'>
            <aside className='panel sidebar-panel'>
                <Sidebar/>
            </aside>
            <div className='panel'>
                <ItemsMiddlePanel kpisData={kpisData}
                                  itemsList={itemsList}
                                  onSelect={onSelect}
                                  loading={loading}
                                  error={err}
                                  onReload={load}
                                  setAdding={setAdding}
                                  adding={adding}
                />
            </div>
            <aside className='panel'>
                <ItemsRightPanel
                    selectedItem={selectedItemM}
                    onClose={() => {
                        setSelectedItem(null);
                        setAdding(false)
                    }}
                    onSave={(form) => onSave(form)}
                    setAdding={setAdding}
                    adding={adding}

                />
            </aside>
        </div>
    )

}


export default Items


