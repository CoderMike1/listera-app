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

    const [query,setQuery] = useState("")
    const [filters, setFilters] = useState({
        stockMin: "",
        stockMax: "",
        priceMin: "",
        priceMax: "",
        sort:""
    })
    const [deleteMode,setDeleteMode] = useState(false)

    const [selectedCategory,setSelectedCategory] = useState(null)





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
                status: draft.status ?? "active",
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


    const filteredItems = useMemo(() => {
        const q = query.trim().toLowerCase();
        const sMin = filters.stockMin === "" ? -Infinity : Number(filters.stockMin);
        const sMax = filters.stockMax === "" ? +Infinity : Number(filters.stockMax);
        const pMin = filters.priceMin === "" ? -Infinity : Number(filters.priceMin);
        const pMax = filters.priceMax === "" ? +Infinity : Number(filters.priceMax);

        let list =  itemsList.filter(it => {
            const hitQ = !q || (it.name?.toLowerCase().includes(q) || it.sku?.toLowerCase().includes(q));
            const stock = Number(it.stock ?? 0);
            const price = Number(it.purchase_price ?? 0);
            const hitStock = stock >= sMin && stock <= sMax;
            const hitPrice = price >= pMin && price <= pMax;
            return hitQ && hitStock && hitPrice;
        });

        if(selectedCategory){
            list = list.filter(it => {
                return it.status === selectedCategory
            })
        }

        switch (filters.sort) {
            case "price_desc":
                list = [...list].sort((a,b) => (Number(b.purchase_price ?? 0) - Number(a.purchase_price ?? 0)));
                break;
            case "price_asc":
                list = [...list].sort((a,b) => (Number(a.purchase_price ?? 0) - Number(b.purchase_price ?? 0)));
                break;
            case "stock_desc":
                list = [...list].sort((a,b) => (Number(b.stock ?? 0) - Number(a.stock ?? 0)));
                break;
            case "stock_asc":
                list = [...list].sort((a,b) => (Number(a.stock ?? 0) - Number(b.stock ?? 0)));
                break;
            default:
                break;
        }

        return list;


    }, [itemsList, query, filters,selectedCategory]);

    const onDelete = useCallback(async (ids) =>{
        const idsArr = Array.isArray(ids) ? ids :[ids];
        if(!idsArr.length) return;

        const ok = confirm(`Delete ${idsArr.length} item(s)?`);
        if(!ok) return;

        try {
            for (const id of idsArr) {
                const res = await window.items.api_delete_item(id);
                if (!res?.ok) throw new Error(`delete failed for ${id}`);
            }
            await load();
        } catch (e) {
            console.error(e);
            setErr(e);
        }
    }, [load])





    return (
        <div className='items-cols'>
            <aside className='panel sidebar-panel'>
                <Sidebar/>
            </aside>
            <div className='panel'>
                <ItemsMiddlePanel kpisData={kpisData}
                                  itemsList={filteredItems}
                                  onSelect={onSelect}
                                  selectedItem={selectedItemM}
                                  loading={loading}
                                  error={err}
                                  onReload={load}
                                  setAdding={setAdding}
                                  adding={adding}

                                  query={query}
                                  setQuery={setQuery}
                                  filters={filters}
                                  setFilters={setFilters}
                                  deleteMode={deleteMode}
                                  setDeleteMode={setDeleteMode}
                                  onDelete={onDelete}

                                  selectedCategory={selectedCategory}
                                  setSelectedCategory={setSelectedCategory}


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


