const path = require("path")
const fs = require("fs")
const Database = require("better-sqlite3")
const {app} = require("electron")



const DB_PATH = path.join(app.getPath("userData"), "items.db")
fs.mkdirSync(path.dirname(DB_PATH), {recursive:true})


const db = new Database(DB_PATH)
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");
db.pragma("foreign_keys = ON");


db.exec(`
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY,          
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  size TEXT DEFAULT 'onesize',
  stock INTEGER DEFAULT 0,
  purchase_price REAL DEFAULT 0,
    selling_price REAL DEFAULT 0,
  status    TEXT NOT NULL
  CHECK (status IN ('active','sold','toship')),
    purchased_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
    sale_at TEXT DEFAULT(null)
    
);
CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);
CREATE INDEX IF NOT EXISTS idx_items_sku  ON items(sku);
CREATE INDEX IF NOT EXISTS idx_items_size ON items(size);
`)

const upsert_item = db.prepare(`
INSERT INTO items (name, sku, size, stock, purchase_price, updated_at)
VALUES ( @name, @sku, COALESCE(@size,'onesize'), COALESCE(@stock,0), COALESCE(@purchase_price,0), datetime('now'))
ON CONFLICT(id) DO UPDATE SET
  name=excluded.name,
  sku=excluded.sku,
  size=excluded.size,
  stock=excluded.stock,
  purchase_price=excluded.purchase_price,
  updated_at=datetime('now')
`)


const add_item = db.prepare(`
INSERT INTO items (name, sku, size,status, stock, purchase_price,purchased_at)
VALUES (@name, @sku, COALESCE(@size,'onesize'),@status, COALESCE(@stock,0), COALESCE(@purchase_price,0),COALESCE(@purchased_at,datetime('now')))
`)
const add_sold_item = db.prepare(`
INSERT INTO items (
  name, sku, size, status, stock, purchase_price, purchased_at, selling_price, sale_at
) VALUES (
  @name,
  @sku,
  COALESCE(@size,'onesize'),
  @status,
  COALESCE(@stock,0),
  COALESCE(@purchase_price,0),
  COALESCE(@purchased_at, datetime('now')),
  COALESCE(@selling_price,0),
  COALESCE(@sale_at,datetime('now'))
)
`);

const update_item = db.prepare(`
UPDATE items SET
  name=@name, sku=@sku, size=COALESCE(@size,'onesize'),
  stock=COALESCE(@stock,0), purchase_price=COALESCE(@purchase_price,0),
  updated_at=datetime('now'),status=@status, selling_price=@selling_price, sale_at=@sale_at,purchased_at=@purchased_at
WHERE id=@id
`)

const update_to_sold_item = db.prepare(`
UPDATE items SET
    status='sold',
    selling_price=COALESCE(@selling_price,0), sale_at=COALESCE(@sale_at,datetime('now'))
WHERE id=@id
`)


const update_to_ship_item = db.prepare(`
UPDATE items SET
    status='toship',
    selling_price=COALESCE(@selling_price,0), sale_at=COALESCE(@sale_at,datetime('now'))
WHERE id=@id
`)

const reduce_stock = db.prepare(`
    UPDATE items SET stock=stock-@sold_stock WHERE id=@id
`)

const mark_as_shipped = db.prepare(`
    UPDATE items SET status='sold' WHERE id=@id
`)


const delete_item = db.prepare(`DELETE FROM items WHERE id = ?`)

const get_all_items = db.prepare(`
SELECT * FROM items
ORDER BY updated_at DESC
LIMIT @limit OFFSET @offset
`);

const count_active_items = db.prepare(`SELECT COUNT(*) AS n FROM items WHERE status = 'active'`)
const count_sold_items = db.prepare(`SELECT COUNT(*) AS s FROM items WHERE status = 'sold'`)
const count_toship_items = db.prepare(`SELECT COUNT(*) AS ts FROM items WHERE status = 'toship'`)


module.exports = {

    getKpis(){
        const total_active_items = count_active_items.get().n;
        const total_toship_items = count_toship_items.get().ts
        const total_sold_items = count_sold_items.get().s + total_toship_items;
        const resp = [
            {icon:"🏭",value:total_active_items,label:"Active"},
            {icon:"🔥",value:total_sold_items,label:"Sold"},
            {icon:"📦️",value:total_toship_items,label:"To Ship"}
        ]

        return {ok:true,results:resp}
    },
    getAll({ limit = 500, offset = 0 } = {}){
        return {ok:true, results:get_all_items.all({limit,offset})}
    },
    add(item){
        add_item.run(item);
        return {ok:true}
    },
    add_sold(item){
        add_sold_item.run(item);
        return {ok:true}
    },
    update(item){
        const resp = update_item.run(item);
        return {ok:resp.changes>0}
    },
    remove(id){
        delete_item.run(id);
        return {ok:true}
    },
    sold_item(item){
        update_to_sold_item.run({selling_price:item.selling_price, sale_at: item.sale_at, id:item.form_data.id})
        return {ok:true}
    },
    toship_item(item){
        update_to_ship_item.run({selling_price:item.selling_price, sale_at: item.sale_at, id:item.form_data.id})
        return {ok:true}
    },

    reduce_stock(item){
        reduce_stock.run({selling_price:item.selling_price, id:item.form_data.id, sold_stock:item.sold_stock})
        return {ok:true}
    },
    mark_as_shipped(item_id){
        mark_as_shipped.run({id:item_id});
        return {ok:true}
    }


}