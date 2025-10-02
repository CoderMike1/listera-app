import SearchBar from "../Dashboard/SearchBar";
import './ItemsMiddlePanel.css'

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import ReactPaginate from "react-paginate";


const STATUS_ENUM = {
    "active":"Active 🟢",
    "sold":"Sold 🟡",
    "toship":"To Ship 🟣"
}


const ItemsMiddlePanel = ({kpisData,itemsList,onSelect,selectedItem,loading,error,onReload,setAdding,adding,currency,query,setQuery,filters,setFilters,deleteMode,setDeleteMode,onDelete,selectedCategory,setSelectedCategory}) => {
    const rows = useMemo(() => itemsList ?? [], [itemsList]);

    const itemsPerPage = 6;
    const [pageNumber,setPageNumber] = useState(0);
    const itemsVisited = itemsPerPage*pageNumber
    const pageCount = Math.ceil(rows.length/itemsPerPage)



    // delete section
    const [selectedIds,setSelectedIds] = useState(()=>new Set());

    const pageSlice = rows.slice(itemsVisited, itemsVisited + itemsPerPage);
    const pageIds = useMemo(() => pageSlice.map(i => String(i.id)), [pageSlice]); // <- String

    const isSelected = useCallback((id) => selectedIds.has(String(id)), [selectedIds])
    const toggleOne = useCallback((id) => {
        const key = String(id);
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    }, []);

    const togglePage = useCallback((select) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (select) pageIds.forEach(id => next.add(id));
            else        pageIds.forEach(id => next.delete(id));
            return next;
        });
    }, [pageIds]);

    const masterRef = useRef(null);
    const allOnPage  = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id));
    const someOnPage = !allOnPage && pageIds.some(id => selectedIds.has(id));
    useEffect(() => {
        if (masterRef.current) masterRef.current.indeterminate = someOnPage;
    }, [someOnPage, allOnPage]);

    useEffect(() => {
        if (!deleteMode) setSelectedIds(new Set());
    }, [deleteMode]);

    const handleBulkDelete = async () => {
        if (!selectedIds.size) return;
        await onDelete(Array.from(selectedIds));
        setSelectedIds(new Set());
        setDeleteMode(false);
    };



    return (
      <div className="imp-container">
          <div className="imp-top-headers">
              <SearchBar setQuery={setQuery} query={query} placeholder="Search by name or sku..." />
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
                  <button className={`chip ${selectedCategory === null ? 'selected': ''}`}  onClick={()=>setSelectedCategory(null)}>All ⚫</button>
                  <button className={`chip ${selectedCategory === 'active' ? 'selected': ''}`} onClick={()=>setSelectedCategory('active')}>Active 🟢</button>
                  <button className={`chip ${selectedCategory === 'sold' ? 'selected': ''}`} onClick={()=>setSelectedCategory('sold')}>Sold 🟡</button>
                  <button className={`chip ${selectedCategory === 'toship' ? 'selected': ''}`} onClick={()=>setSelectedCategory('toship')}>To Ship 🟣</button>
              </div>



              <div className="imp-tools">
                  <div className="imp-refresher">
                      <button onClick={()=>onReload()}>🔄</button>
                  </div>
                  <div className="imp-deleter">
                      <button
                          className={`btn-delete-mode ${deleteMode ? 'on' : ''}`}
                          onClick={() => setDeleteMode(v => !v)}
                          title="Toggle delete mode"
                      >
                          🗑️ {deleteMode ? 'Cancel' : 'Delete'}
                      </button>
                  </div>
                  <details className="imp-filters">
                      <summary className="imp-btn">Filters</summary>
                      <div className="imp-filters-pop">
                          <div className="imp-filters-grid">
                              <label>
                                  <div>Stock min</div>
                                  <input
                                      type="radio"
                                      name="sort"
                                      value="stock_asc"
                                      checked={filters.sort === "stock_asc"}
                                      onChange={()=> setFilters(f => ({...f,sort:"stock_asc"}))}
                                  />
                              </label>
                              <label>
                                  <div>Stock max</div>
                                  <input
                                      type="radio"
                                      name="sort"
                                      value="stock_desc"
                                      checked={filters.sort === "stock_desc"}
                                      onChange={() => setFilters(f=>({...f,sort:"stock_desc"}))}
                                      />
                              </label>
                              <label>
                                  <div>Price min</div>
                                  <input
                                      type="radio"
                                      name="sort"
                                      value="price_asc"
                                      checked={filters.sort === "price_asc"}
                                      onChange={() => setFilters(f=>({...f,sort:"price_asc"}))}
                                  />
                              </label>
                              <label>
                                  <div>Price max</div>
                                  <input
                                      type="radio"
                                      name="sort"
                                      value="price_desc"
                                      checked={filters.sort === "price_desc"}
                                      onChange={() => setFilters(f=>({...f,sort:"price_desc"}))}
                                  />
                              </label>
                          </div>
                          <button
                              className="imp-btn"
                              onClick={() => setFilters({ size:"", stockMin:"", stockMax:"", priceMin:"", priceMax:"", sort:"" })}

                          >
                              Clear
                          </button>
                      </div>
                  </details>

              </div>
          </div>

          <div className="imp-table-wrap">
              <table className="imp-table">
                  <thead>
                  <tr>
                      {deleteMode && (
                          <th className="w-8">
                              <input
                                  ref={masterRef}
                                  type="checkbox"
                                  checked={allOnPage}
                                  onChange={() => togglePage(!allOnPage)} // <- nie używamy e.target.checked
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label="Select all on page"
                              />
                          </th>
                      )}
                      <th></th>
                      <th>Name</th>
                      <th>SKU</th>
                      <th>Size</th>
                      <th>Stock</th>
                      {(selectedCategory === 'active' || !selectedCategory) ?
                          <th>Purchase Price</th>
                          :
                          <th>Profit</th>
                      }

                      <th>Status</th>
                  </tr>
                  </thead>
                  <tbody>
                  {pageSlice && pageSlice.length > 0 ?(
                      pageSlice.map((i)=>(
                              <tr key={i.id} onClick={() => {
                                  if (deleteMode) return;
                                  onSelect(i);
                                  setAdding(false);
                              }}

                                  className={selectedItem?.id === i.id ? "selected" : ""}

                              >
                                  {deleteMode && (
                                      <td>
                                          <input
                                              type="checkbox"
                                              checked={isSelected(i.id)}
                                              onChange={(e) => { e.stopPropagation(); toggleOne(i.id); }}
                                              onClick={(e) => e.stopPropagation()}
                                              aria-label={`Select ${i.name}`}
                                          />
                                      </td>
                                  )}
                                  <td>
                                      <img className="imp-cell-image" src={i.image}  alt={i.name}/>
                                  </td>
                                  <td className="imp-cell-name">
                                      <span className="imp-cell-name-strong">{i.name}</span>
                                  </td>

                                  <td>{i.sku}</td>
                                  <td>{i.size}</td>
                                  <td>{i.stock}</td>
                                  {(selectedCategory === 'active' || !selectedCategory) ?
                                      <td>{i.purchase_price} {currency}</td>
                                      :
                                      <td>{i.sold_price - i.purchase_price} {currency}</td>
                                  }

                                  <td>{STATUS_ENUM[i.status]}</td>

                              </tr>
                          ))
                  )
                      :
                      <tr>
                      <td colSpan={8} className="imp-table-empty">no items found...</td>
                     </tr>


                  }

                  </tbody>
              </table>

              {deleteMode && (
                  <div className="imp-delete-toolbar">
                      <div>{selectedIds.size} selected</div>
                      <div className="spacer" />
                      <button className="imp-btn ghost" onClick={() => setDeleteMode(false)}>Cancel</button>
                      <button
                          className="imp-btn danger"
                          disabled={!selectedIds.size}
                          onClick={handleBulkDelete}
                      >
                          Delete selected
                      </button>
                  </div>
              )}
              {pageSlice && pageSlice.length >0 ?
                  <ReactPaginate
                      pageCount={pageCount}
                      onPageChange={({selected}) => setPageNumber(selected)}
                      containerClassName={"paginationBttns"}
                      previousLinkClassName={"previousBttn"}
                      nextLinkClassName={"nextBttn"}
                      disabledClassName={"paginactionDisabled"}
                      activeClassName={"paginationActive"}
                  />
                  :
                  <></>
              }

          </div>
      </div>
  )
}


export default ItemsMiddlePanel

