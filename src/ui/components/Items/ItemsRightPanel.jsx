import {useEffect, useState} from "react";
import './ItemsRightPanel.css'

const DEFAULT_FORM = {name:"",sku:"",size:"",image:"",stock:0,purchase_price:0,status:"active"}

const STATUS_ENUM = {
    "active":"Active",
    "sold":"Sold",
    "toship":"To Ship"
}

const ItemsRightPanel = ({ selectedItem, onSave, onClose,setAdding,adding,editing,setEditing,load ,currency}) =>{

    const [form,setForm] = useState(null)
    const [showSalesForm,setShowSalesForm] = useState(false);
    const [loading, setLoading] = useState(false)
    const [searchedValue,setSearchedValue] = useState("")
    const [searchResults,setSearchResults] = useState([])

    const [sellingPrice, setSellingPrice] = useState(0);
    const [saleDate,setSaleDate] = useState(new Date().toISOString().slice(0, 10))
    const [shipped,setShipped] = useState(false)
    const [saleQty,setSaleQty] = useState(1);




    useEffect(() => {
        if(selectedItem){
            const { id, name, sku, size,image, stock, purchase_price,status,selling_price,sale_at,purchased_at } = selectedItem;
            setForm({ id, name, sku, size,image, stock, purchase_price,status,selling_price,sale_at,purchased_at });
        }
        else{
            if(adding){
                setForm({ ...DEFAULT_FORM });
            }
            else{
                setForm(null)
            }

        }
    }, [selectedItem,adding]);
    const update = (k,v) => setForm(f => ({...f,[k]:v}))

    const handleSubmit = (e) =>{
        e.preventDefault()
        if(!form) return;
        setEditing(false)
        onSave(form)
    }

    const confirmSale = async (e) =>{
        e.preventDefault()

        const f = {
            form_data:form,
            selling_price:sellingPrice,
            sale_at:saleDate,
            shipped:shipped,
            sold_stock:saleQty
        }
        const resp = await window.items.api_add_sold_item(f);
        if(!resp.ok){
            throw new Error("erorr")
        }
        else{
            await load();
            setShowSalesForm(false)
            setSaleQty(1)
            setSellingPrice(0)
            setShipped(false)
            setSaleDate(new Date().toISOString().slice(0, 10))
        }

    }

    const confirmShipped = async () =>{
        if(loading) return;
        setLoading(true)
        const resp = await window.items.api_mark_item_as_shipped(form.id)
        if(!resp.ok){
            throw new Error("erro")
        }
        else{
            await load()
            setLoading(false)
        }

    }

    const searchItem = async ()=>{
        const res = await window.items.api_search_product_by_query(searchedValue);

        const {ok,results} = res;
        if(!ok){
            throw new Error("error while getting product data")
        }

        setSearchResults(results);

    }

    const selectSearchResult = (result) =>{

        const f = {name:result.product_name,sku:result.product_sku,image:result.product_image,size:"",stock:0,purchase_price:0,status:"active"}

        setForm(f);

        setSearchResults([])
        setSearchedValue("");

    }

    const isCheckDetails = !adding && form && !editing

    const isAdding = adding && form
    return(
        <div className="rp-container">
            {
                isCheckDetails &&
                    (
                        <div className="rp-details">
                            <div className="rp-details-header">
                                <h3>Details</h3>
                                <button className="rp-edit-button ghost" onClick={()=> {
                                    onClose()
                                }}>x</button>
                            </div>
                            <div className="rp-details-grid">
                                <div className="rp-details-grid-image">
                                    <img height={150} src={form?.image} alt='dunk'/>
                                    <div className="fact fact-name">
                                        <div className="fact-label">Name</div>
                                        <div className="fact-value">{form?.name}</div>
                                    </div>
                                </div>
                                <div className="rp-facts">

                                    <div className="fact">
                                        <div className="fact-label">Size</div>
                                        <div className="fact-value">{form?.size}</div>
                                    </div>
                                    <div className="fact">
                                        <div className="fact-label">Stock</div>
                                        <div className="fact-value">{form?.stock}</div>
                                    </div>
                                    <div className="fact">
                                        <div className="fact-label">Purchase Price</div>
                                        <div className="fact-value">{form?.purchase_price} {currency}</div>
                                    </div>
                                    {form?.status !== "active" &&
                                        <div className="fact">
                                            <div className="fact-label">Selling Price</div>
                                            <div className="fact-value">{form?.selling_price} {currency}</div>
                                        </div>

                                    }
                                    <div className="fact">
                                        <div className="fact-label">Status</div>
                                        <div className="fact-value">{STATUS_ENUM[form?.status]}</div>
                                    </div>

                                    <div className="fact">
                                        <div className="fact-label">To Ship?</div>
                                        <div className="fact-value">{form?.status === "toship" ? 'Yes' : 'No'}</div>
                                    </div>
                                    {form?.status !== "active" &&
                                        <div className="fact">
                                            <div className="fact-label">Sale date</div>
                                            <div className="fact-value">{form?.sale_at}</div>
                                        </div>

                                    }
                                    <div className="fact">
                                        <div className="fact-label">Purchase Date</div>
                                        <div className="fact-value">{String(form?.purchased_at ?? "").slice(0, 10) || "—"}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="rp-details-actions">
                                {form?.status === 'active' &&
                                    <div className="rp-details-actions-btn">
                                        <button onClick={()=>setShowSalesForm(true)}>Sell</button>
                                    </div>
                                }

                                <div className="rp-details-actions-btn">
                                    <button onClick={()=> {
                                        setEditing(true)
                                    }}>Edit</button>
                                </div>
                                {
                                    form?.status === "toship"
                                    &&
                                        <div className="rp-details-actions-btn">
                                            <button onClick={()=> {
                                                confirmShipped()
                                            }}>{loading ? 'Loading':'Ship'}</button>
                                        </div>
                                }

                            </div>

                            {showSalesForm && (
                                <div
                                    className="rp-modal"
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby="soldFormTitle"
                                    onKeyDown={(e) => e.key === "Escape" && setShowSalesForm(false)}
                                >
                                    <div className="rp-modal-backdrop" onClick={() => setShowSalesForm(false)} />
                                    <div className="rp-modal-content" role="document">
                                        <div className="rp-modal-header">
                                            <h4 id="soldFormTitle">Complete sale</h4>
                                            <button
                                                className="rp-modal-close"
                                                aria-label="Close"
                                                onClick={() => setShowSalesForm(false)}
                                            >×</button>
                                        </div>

                                        <div className="rp-sold">
                                            <div className="rp-sold-head">
                                                <div className="rp-sold-hint">Enter price, date and quantity, then confirm.</div>
                                            </div>
                                            <div className="rp-sold-grid">
                                                <div className="form-group">
                                                    <label>Selling price</label>
                                                    <input
                                                        type="number"
                                                        inputMode="numeric"
                                                        min="0"
                                                        value={sellingPrice}
                                                        onChange={(e) => setSellingPrice(e.target.value)}
                                                        placeholder="e.g. 1299"
                                                        autoFocus
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label>Sale Date</label>
                                                    <input
                                                        type="date"
                                                        value={saleDate}
                                                        onChange={(e) => setSaleDate(e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Quantity</label>
                                                    <input
                                                        type="number"
                                                        inputMode="numeric"
                                                        min={1}
                                                        max={form?.stock}
                                                        step={1}
                                                        value={saleQty}
                                                        onChange={(e)=>{
                                                            setSaleQty(Number(e.target.value))
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group form-group--checkbox">
                                                    <label>Shipped?</label>
                                                    <input
                                                        type="checkbox"
                                                        checked={shipped}
                                                        onChange={(e) => setShipped(e.target.checked)}
                                                    />
                                                </div>


                                                <div className="form-actions">
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={confirmSale}
                                                        disabled={!sellingPrice || !saleDate}
                                                    >
                                                        Confirm sale
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )
            }
            {editing &&
            <div className="rp-edit">
                <div className="rp-edit-header">
                    <h3>Edit Item</h3>
                    <button className="rp-edit-button ghost" onClick={()=> {
                        onClose()
                    }}>x</button>
                </div>
                <div className="rp-details-grid-image">
                    <img src={form.image?? ""} alt='dunk'  height={150}/>
                </div>
                <form className="rp-edit-form-grid" onSubmit={handleSubmit} noValidate>
                    <label>
                        <span>Name</span>
                        <input value={form.name ?? ""} onChange={e => update("name",e.target.value)}/>
                    </label>
                    <label>
                        <span>Sku</span>
                        <input value={form.sku ?? ""} onChange={e => update("sku",e.target.value)}/>
                    </label>
                    <label>
                        <span>Size</span>
                        <input value={form.size ?? ""} onChange={e => update("size",e.target.value)}/>
                    </label>
                    <label>
                        <span>Stock</span>
                        <input type="number" value={form.stock ?? ""} onChange={e => update("stock",e.target.value)}/>
                    </label>
                    <label>
                        <span>Purchase Price</span>
                        <input type="number" step="0.01" value={form?.purchase_price ?? ""} onChange={e=>update("purchase_price",e.target.value)}/>
                    </label>
                    {
                        form?.status !== 'active' &&

                        <label>
                            <span>Selling price</span>
                            <input type="number" step="0.01" value={form?.selling_price ?? ""} onChange={e=>update("selling_price",e.target.value)}/>

                        </label>
                    }
                    <label>
                        <span>Status</span>
                        <select
                            value={form?.status ?? "active"}
                            onChange={(e) => update("status", e.target.value)}
                        >
                            <option value="active">{STATUS_ENUM["active"]}</option>
                            <option value="sold">{STATUS_ENUM["sold"]}</option>
                            <option value="toship">{STATUS_ENUM["toship"]}</option>
                        </select>
                    </label>
                    <label>
                        <span>Purchase date</span>
                        <input
                            type="date"
                            value={form?.purchased_at ? String(form.purchased_at).slice(0, 10) : ""}
                            onChange={(e) => update("purchased_at", e.target.value)}
                        />
                    </label>
                    {form?.status !== 'active' &&
                        <label>
                            <span>Sale date</span>
                            <input
                                type="date"
                                value={form?.sale_at ? String(form.sale_at).slice(0, 10) : ""}
                                onChange={(e) => update("sale_at", e.target.value)}
                            />
                        </label>
                    }

                    <div className="rp-edit-buttons">
                        <button className="rp-edit-btn primary" type="submit">✔</button>
                    </div>
                </form>

            </div>
            }

                    {isAdding &&
                    <div className="rp-add">
                        <div className="rp-add-header">
                            <h3>Add Item</h3>
                            <button className="rp-edit-button ghost" onClick={()=>{ setAdding(false); setForm(null); }}>x</button>
                        </div>

                        <div className="rp-add-search">
                            <h4>Search item</h4>
                            <input value={searchedValue} onChange={e=>setSearchedValue(e.target.value)}/>
                            <button onClick={()=>searchItem()}>Search</button>
                        </div>

                        {searchResults.length >0 &&
                            (
                                    <ul className="rp-search-results">
                                        {searchResults.map((r) =>(

                                            <li key={r.product_name} className="rp-search-item" onClick={()=>selectSearchResult(r)}>
                                                <img className="rp-search-img" src={r.product_image} alt={r.product_name}/>
                                                <div className="rp-search-text">
                                                    <div className="rp-search-title">{r.product_name}</div>
                                                    <div className="rp-search-sku">{r.product_sku}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                            )

                        }

                        <form className="rp-add-form-grid" onSubmit={handleSubmit} noValidate>
                            <label>
                                <span>Name</span>
                                <input value={form.name ?? ""} onChange={e => update("name", e.target.value)} required />
                            </label>
                            <label>
                                <span>Sku</span>
                                <input value={form.sku ?? ""} onChange={e => update("sku", e.target.value)} required />
                            </label>
                            <label>
                                <span>Size</span>
                                <input value={form.size ?? ""} onChange={e => update("size", e.target.value)} />
                            </label>
                            <label>
                                <span>Stock</span>
                                <input type="number" value={form.stock ?? 0} onChange={e => update("stock", e.target.value)} />
                            </label>
                            <label>
                                <span>Purchase Price</span>
                                <input type="number" step="0.01" value={form.purchase_price ?? ""} onChange={e => update("purchase_price", e.target.value)} />
                            </label>
                            <label>
                                <span>Purchase date</span>
                                <input
                                    type="date"
                                    value={form?.purchased_at ? String(form.purchased_at).slice(0, 10) : ""}
                                    onChange={(e) => update("purchased_at", e.target.value)}
                                />
                            </label>
                            <div className="rp-add-buttons">
                                <button className="rp-add-btn primary" type="submit">✔</button>
                            </div>
                        </form>


                    </div>

                    }



        </div>
    )
}

export default ItemsRightPanel

