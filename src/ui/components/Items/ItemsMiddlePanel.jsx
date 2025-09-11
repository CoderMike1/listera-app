import SearchBar from "../Dashboard/SearchBar";
import './ItemsMiddlePanel.css'

import dunkPNG from '../../assets/dunk1.png'





const ItemsMiddlePanel = ({kpisData,itemsList,onSelect,loading,error,onReload,setAdding,adding}) => {



  return (
      <div className="imp-container">
          <div className="imp-top-headers">
              <SearchBar/>
              <button className="btn-add" onClick={() => {
                  setAdding(!adding);
                  onSelect(null)
              }}>
                  <span className="btn-add-span" >+</span>
                  Add Item
              </button>
          </div>


          <div className="imp-kpis">
              {kpisData.map((k) =>(
                  <div className="imp-card" key={k.label}>
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

          <div className="imp-table-wrap">
              <table className="imp-table">
                  <thead>
                  <tr>
                      <th></th>
                      <th>Name</th>
                      <th>SKU</th>
                      <th>Size</th>
                      <th>Stock</th>
                      <th>Purchase Price</th>
                  </tr>
                  </thead>
                  <tbody>
                  {itemsList.map((i)=>(
                      <tr key={i.id} onClick={() => {
                          onSelect(i);
                          setAdding(false)
                      }}>
                          <td>
                              <img src={dunkPNG} width={50} height={50} alt={i.name}/>
                          </td>
                          <td className="imp-cell-name">
                              <span className="imp-cell-name-strong">{i.name}</span>
                          </td>
                          <td>{i.sku}</td>
                          <td>{i.size}</td>
                          <td>{i.stock}</td>
                          <td>{i.purchase_price}</td>
                      </tr>
                  ))}
                  </tbody>
              </table>
          </div>




      </div>
  )
}


export default ItemsMiddlePanel