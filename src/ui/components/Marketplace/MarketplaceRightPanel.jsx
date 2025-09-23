import './MarketplaceRightPanel.css'
import {useMemo, useState} from "react";
import AutocompleteItemSelect from "./AutocompleteItemSelect";

const MarketplaceRightPanel = ({adding,setAdding,items})=>{

    const [selectedItemId,setSelectedItemId] = useState("")
    const [marketplace,setMarketplace] = useState("")
    const [payoutPrice, setPayoutPrice] = useState("")
    console.log(items)
    const selectedItem = useMemo(()=>
    items.find(i=>String(i.id) === String(selectedItemId)) || null,
        [items,selectedItemId]
    )

    const handleSubmit = ()=>{

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

                    <form onSubmit={handleSubmit}>
                        <AutocompleteItemSelect
                            items={items}
                            onSelect={(it) => setSelectedItem(it)}
                        />
                    </form>


                </div>
            }
        </div>
    )

}

export default MarketplaceRightPanel