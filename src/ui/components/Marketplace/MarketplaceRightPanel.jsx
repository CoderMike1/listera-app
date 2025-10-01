import './MarketplaceRightPanel.css'
import {useMemo, useState} from "react";
import dunkPNG from "../../assets/dunk1.png";


const SITES = ['HypeBoost','Stockx']

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const MarketplaceRightPanel = ({items,selectedItem,onClose,setRun,marketplacesStatuses})=>{

    const [adding,setAdding] = useState(false)
    const [payoutPrice,setPayoutPrice] = useState("")
    const [listingStock,setListingStock] = useState(0)
    const [minimumPrice,setMinimumPrice] = useState("")

    function badgeClass(status) {
        const s = (status || '').toLowerCase();
        if (s === 'listed')   return 'is-listed';
        if (s === 'running')  return 'is-running';
        if (s === 'error')    return 'is-error';
        return 'is-unlisted';
    }
    const showDetails = selectedItem || null;

    const addListing = async (e) =>{
        e?.preventDefault?.();



        setAdding(false)
        setPayoutPrice("")
        setListingStock(0)
        setMinimumPrice("")
        setRun('running',selectedItem.id);
        await sleep(20000)
        try{
            const add_listing_form = {
                site: "HypeBoost",
                sku: String(selectedItem.sku ?? ''),
                size: String(selectedItem.size ?? ''),
                payout_price: String(payoutPrice ?? ''),
                minimum_price: String(minimumPrice ?? ''),
            };

            const resp = await window.marketplace.api_add_listing(add_listing_form)
            console.log(resp)
            const {payout_price,listing_price,listing_id,site} = resp.results
            const task_form = {
                id:selectedItem.id,
                listing_id:listing_id,
                name:selectedItem.name,
                size:selectedItem.size,
                stock:1,
                sku:selectedItem.sku,
                payout_price:payout_price,
                listing_price:listing_price,
                mode:"standard",
                status:"listed",
                site:site,
                created_at: new Date().toISOString()

            }
            await window.marketplace.api_add_task(task_form)
            setRun('listed',selectedItem.id);
        }
        catch(e){
            setRun('error',selectedItem.id)
            console.log(e)
        }


    }
    const deleteListing = (e) =>{



    }

    return (
        <div className="mrp-container">
            {
                showDetails &&
                <div className="mrp-details">
                    <div className="mrp-details-header">
                        <h3>Details</h3>
                        <button className="mrp-edit-button ghost" onClick={()=> {
                            onClose()
                        }}>x</button>
                    </div>

                    <div className="mrp-details-grid">
                        <div className="mrp-details-grid-image">
                            <img src={dunkPNG} alt='dunk' width={150} height={150}/>
                            <div className="fact fact-name">
                                <div className="fact-label">Name</div>
                                <div className="fact-value">{selectedItem.name}</div>
                            </div>
                        </div>
                        <div className="rp-facts">
                            <div className="fact">
                                <div className="fact-label">Size</div>
                                <div className="fact-value">{selectedItem.size}</div>
                            </div>
                            <div className="fact">
                                <div className="fact-label">Stock</div>
                                <div className="fact-value">{selectedItem.stock}</div>
                            </div>
                            <div className="fact">
                                <div className="fact-label">Purchase Price</div>
                                <div className="fact-value">{selectedItem.purchase_price}</div>
                            </div>
                            <div className="fact">
                                <div className="fact-label">Purchase Date</div>
                                <div className="fact-value">{String(selectedItem.purchased_at ?? "").slice(0, 10) || "—"}</div>
                            </div>
                        </div>
                    </div>

                    <div className="mrp-mkt-status">
                        {SITES.map((site) => {

                            const mkt = marketplacesStatuses?.[selectedItem.id]?.[site] || {
                                status: 'unlisted',
                                listingPayout: null,
                                listingPrice: null
                            };

                            return (
                                <div key={site} className="mrp-mkt-card">
                                    <div className="mrp-mkt-header">
                                        <span className="mrp-mkt-name">{site}</span>
                                        <span className={`mrp-mkt-badge ${badgeClass(mkt.status)}`}>
                                      {mkt.status || '—'}
                                    </span>
                                    </div>
                                    <div className="mrp-mkt-fields">
                                        <div className="mrp-mkt-field">
                                            <div className="mrp-mkt-label">Listing payout</div>
                                            <div className="mrp-mkt-value">
                                                {mkt.listingPayout != null ? `€ ${mkt.listingPayout}` : '—'}
                                            </div>
                                        </div>
                                        <div className="mrp-mkt-field">
                                            <div className="mrp-mkt-label">Listing price</div>
                                            <div className="mrp-mkt-value">
                                                {mkt.listingPrice != null ? `€ ${mkt.listingPrice}` : '—'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mrp-mkt-actions">
                                        {mkt.status === 'unlisted' && (
                                            <button
                                                className="mrp-btn primary"
                                                type="button"
                                                onClick={() => setAdding(true)}
                                            >
                                                Add
                                            </button>
                                        )}
                                        {mkt.status === "listed" && (
                                            <button
                                                className="mrp-btn danger"
                                                type="button"
                                                onClick={() => deleteListing()}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>

                                </div>
                            )


                        }
                            )
                        }
                    </div>

                </div>

            }

            {
                adding &&
                <div
                    className="mrp-al-container"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="soldFormTitle"
                    // onKeyDown={(e) => e.key === "Escape" && setShowSalesForm(false)}
                >
                    <div className="mrp-al-backdrop" onClick={() => setAdding(false)} />
                    <div className="mrp-al-content" role="document">
                        <div className="mrp-al-header">
                            <h4>Add Listing</h4>
                            <button
                                className="mrp-al-close"
                                aria-label="Close"
                                onClick={() => setAdding(false)}
                            >×</button>
                        </div>

                        <div className="mrp-al">
                            {/*<div className="mrp-al-head">*/}
                            {/*    <div className="mrp-al-hint">Enter price, date and quantity, then confirm.</div>*/}
                            {/*</div>*/}
                            <div className="mrp-al-grid">
                                <div className="mrp-al-form-group">
                                    <label>Payout price</label>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        min="0"
                                        value={payoutPrice}
                                        onChange={(e) => setPayoutPrice(e.target.value)}
                                        placeholder="e.g. 1299"
                                        autoFocus
                                    />
                                </div>
                                <div className="mrp-al-form-group">
                                    <label>Minimum price</label>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        min="0"
                                        value={minimumPrice}
                                        onChange={(e) => setMinimumPrice(e.target.value)}
                                        placeholder="e.g. 1299"
                                        autoFocus
                                    />
                                </div>
                                <div className="mrp-al-form-group">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        min={1}
                                        max={selectedItem.stock}
                                        step={1}
                                        value={listingStock}
                                        onChange={(e)=>{
                                            setListingStock(Number(e.target.value))
                                        }}
                                    />
                                </div>



                                <div className="mrp-al-form-actions">
                                    <button
                                        className="btn btn-success"
                                        onClick={addListing}
                                        disabled={!listingStock || !payoutPrice}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }



        </div>
    )

}

export default MarketplaceRightPanel