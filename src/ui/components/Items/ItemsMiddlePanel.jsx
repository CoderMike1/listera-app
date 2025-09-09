import SearchBar from "../Dashboard/SearchBar";
import './ItemsMiddlePanel.css'

const KPIS = [
    {icon:"📦",value:"993",label:"Listed"},
    {icon:"🧾",value:"435",label:"Inactive"},
    {icon:"⚠️",value:"312",label:"Errors"}
]


const ItemsMiddlePanel = () => {
  return (
      <div className="imp-container">
          <div className="imp-top-headers">
              <SearchBar/>
              <button className="btn-add">
                  <span className="btn-add-span">+</span>
                  Add Item
              </button>
          </div>


          <div className="imp-kpis">
              {KPIS.map((k) =>(
                  <div className="imp-card">
                      <div className="imp-card-icon">{k.icon}</div>
                      <div className="imp-card-main">
                          <div className="imp-card-value">{k.value}</div>
                          <div className="imp-card-label">{k.label}</div>
                      </div>
                  </div>
              ))}

          </div>

          <div className="imp-toolbar">
              <div className="imp-chips">
                  <button className="chip selected">Active</button>
                  <button className="chip">Draft</button>
                  <button className="chip">Inactive</button>
                  <button className="chip">Errors</button>
              </div>
              <div className="imp-tools">
                  <button className="imp-btn imp-btn--ghost">Filters ▾</button>
                  <button className="imp-btn imp-btn--ghost" aria-label="View options">
                      <span className="imp-icon-menu" />
                  </button>
              </div>
          </div>




      </div>
  )
}


export default ItemsMiddlePanel