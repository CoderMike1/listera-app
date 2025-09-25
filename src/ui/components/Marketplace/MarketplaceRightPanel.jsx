import './MarketplaceRightPanel.css'
import {useMemo, useState} from "react";
import AutocompleteItemSelect from "./AutocompleteItemSelect";

const MarketplaceRightPanel = ({adding,setAdding,items})=>{

    const [selectedItem,setSelectedItem] = useState("")
    const [marketplace,setMarketplace] = useState("")
    const [payoutPrice, setPayoutPrice] = useState("")
    const [mode,setMode] = useState("")

    const handleSubmit = async (e)=>{
        e.preventDefault()

        const payload = {
            name:String(selectedItem.name ?? ""),
            sku: String(selectedItem.sku ?? ""),
            size: String(selectedItem.size ?? ""),
            payout_price: String(payoutPrice),
            marketplace: String(marketplace),
            mode: String(mode)
        }

        const resp = await window.marketplace.api_add_task(payload)
        if(!resp.ok){
            throw new Error("sdsa")
        }
        else{
            setSelectedItem(null);
            setMarketplace("");
            setPayoutPrice("");
            setMode("")
            setAdding(false);
        }
    }

    return (
        <div className="mrp-container">
            {
                adding &&
                <div className="mrp-add">
                    <div className="mrp-add-header">
                        <h3>Add Task</h3>
                        <button className="mrp-edit-button ghost" onClick={()=>{ setAdding(false) }}>x</button>
                    </div>

                    <form onSubmit={handleSubmit} className="mrp-form-grid">
                        <AutocompleteItemSelect
                            items={items}
                            onSelect={(it) => setSelectedItem(it)}
                        />
                        <div className={`mrp-preview ${selectedItem ? "is-filled":""}`}>
                            <div><b>Name:</b> {selectedItem?.name || "—"}</div>
                            <div><b>SKU:</b> {selectedItem?.sku || "—"}</div>
                            <div><b>Size:</b> {selectedItem?.size || "—"}</div>
                        </div>

                        <label className="mrp-label">
                            <span>Marketplace</span>
                            <select
                                className="mrp-select"
                                value={marketplace}
                                onChange={(e)=>setMarketplace(e.target.value)}
                                required
                            >
                                <option value="">— Select —</option>
                                <option value="stockx">StockX</option>
                                <option value="klekt">Klekt</option>
                                <option value="alias">Alias</option>
                                <option value="hypeboost">Hypeboost</option>
                            </select>
                        </label>

                        <label className="mrp-label">
                            <span>Mode</span>
                            <select
                                className="mrp-select"
                                value={mode}
                                onChange={(e)=>setMode(e.target.value)}
                                required>
                                <option value="">— Select —</option>
                                <option value="add">Add Listing</option>
                                <option value="brick_mode">Brick Mode</option>
                            </select>
                        </label>

                        <label className="mrp-label">
                           <span>Payout price</span>
                            <input
                                className="mrp-input"
                                type="number"
                                min="0"
                                step="0.01"
                                value={payoutPrice}
                                onChange={(e)=>setPayoutPrice(e.target.value)}
                                placeholder="ex. 130"
                                required />

                        </label>

                        <div className="mrp-add-buttons">
                            <button className="mrp-add-btn primary" type="submit">✔</button>
                        </div>



                    </form>


                </div>
            }

        </div>
    )

}

export default MarketplaceRightPanel