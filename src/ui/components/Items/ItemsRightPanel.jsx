import {useEffect, useState} from "react";
import './ItemsRightPanel.css'

const DEFAULT_FORM = {name:"",sku:"",size:"",stock:0,purchase_price:0}

const ItemsRightPanel = ({ selectedItem, onSave, onClose,setAdding,adding }) =>{

    const [form,setForm] = useState(null)

    const [searchedValue,setSearchedValue] = useState("")

    useEffect(() => {
        if(selectedItem){
            const { id, name, sku, size, stock, purchase_price } = selectedItem;
            setForm({ id, name, sku, size, stock, purchase_price });
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
        onSave(form)
    }

    const isEditing = !adding && form
    const isAdding = adding && form

    return(
        <div className="rp-container">
            {isEditing ?
            <div className="rp-edit">
                <div className="rp-edit-header">
                    <h3>Edit Item</h3>
                    <button className="rp-edit-button ghost" onClick={()=> {
                        onClose()
                    }}>x</button>
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

                    <div className="rp-edit-buttons">
                        <button className="rp-edit-btn primary" type="submit">✔</button>
                    </div>
                </form>
                {/*<div className="rp-edit-form-grid">*/}
                {/*    <label>*/}
                {/*        <span>Name</span>*/}
                {/*        <input value={form?.name ?? ""} onChange={e=>update("name",e.target.value) }/>*/}
                {/*    </label>*/}
                {/*    <label>*/}
                {/*        <span>Sku</span>*/}
                {/*        <input value={form?.sku ?? ""} onChange={e=>update("sku",e.target.value) }/>*/}
                {/*    </label>*/}
                {/*    <label>*/}
                {/*        <span>Size</span>*/}
                {/*        <input value={form?.size ?? ""} onChange={e=>update("size",e.target.value) }/>*/}
                {/*    </label>*/}
                {/*    <label>*/}
                {/*        <span>Stock</span>*/}
                {/*        <input type="number" value={form?.stock ?? 0} onChange={e=>update("stock",e.target.value) }/>*/}
                {/*    </label>*/}
                {/*    <label>*/}
                {/*        <span>Purchase Price</span>*/}
                {/*        <input type="number" step="0.01" value={form?.purchase_price ?? ""} onChange={e=>update("purchase_price",e.target.value) }/>*/}
                {/*    </label>*/}

                {/*</div>*/}

            </div>
            :
                <>
                    {isAdding ?
                    <div className="rp-add">
                        <div className="rp-add-header">
                            <h3>Add Item</h3>
                            <button className="rp-edit-button ghost" onClick={()=>{ setAdding(false); setForm(null); }}>x</button>
                        </div>

                        <div className="rp-add-search">
                            <h4>Search item</h4>
                            <input value={searchedValue} onChange={e=>setSearchedValue(e.target.value)}/>
                        </div>

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

                            <div className="rp-add-buttons">
                                <button className="rp-add-btn primary" type="submit">✔</button>
                            </div>
                        </form>

                        {/*<div className="rp-add-form-grid">*/}
                        {/*    <label>*/}
                        {/*        <span>Name</span>*/}
                        {/*        <input value={form?.name ?? ""} onChange={e=>update("name",e.target.value) }/>*/}
                        {/*    </label>*/}
                        {/*    <label>*/}
                        {/*        <span>Sku</span>*/}
                        {/*        <input value={form?.sku ?? ""} onChange={e=>update("sku",e.target.value) }/>*/}
                        {/*    </label>*/}
                        {/*    <label>*/}
                        {/*        <span>Size</span>*/}
                        {/*        <input value={form?.size ?? ""} onChange={e=>update("size",e.target.value) }/>*/}
                        {/*    </label>*/}
                        {/*    <label>*/}
                        {/*        <span>Stock</span>*/}
                        {/*        <input type="number" value={form?.stock ?? 0} onChange={e=>update("stock",e.target.value) }/>*/}
                        {/*    </label>*/}
                        {/*    <label>*/}
                        {/*        <span>Purchase Price</span>*/}
                        {/*        <input type="number" step="0.01" value={form?.purchase_price ?? ""} onChange={e=>update("purchase_price",e.target.value) }/>*/}
                        {/*    </label>*/}

                        {/*</div>*/}

                        {/*<div className="rp-add-buttons">*/}
                        {/*    <button className="rp-add-btn primary" onClick={()=>onSave(form)}>✔</button>*/}
                        {/*</div>*/}



                    </div>
                        :
                        <>
                        </>
                    }


                </>

            }

        </div>
    )
}


export default ItemsRightPanel

