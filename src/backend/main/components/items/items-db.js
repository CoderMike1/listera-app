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
  status    TEXT NOT NULL
  CHECK (status IN ('active','sold','toship')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
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
INSERT INTO items (name, sku, size,status, stock, purchase_price)
VALUES (@name, @sku, COALESCE(@size,'onesize'),@status, COALESCE(@stock,0), COALESCE(@purchase_price,0))
`)

const update_item = db.prepare(`
UPDATE items SET
  name=@name, sku=@sku, size=COALESCE(@size,'onesize'),
  stock=COALESCE(@stock,0), purchase_price=COALESCE(@purchase_price,0),
  updated_at=datetime('now')
WHERE id=@id
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
        const total_sold_items = count_sold_items.get().s;
        const total_toship_items = count_toship_items.get().ts
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
    update(item){
        const resp = update_item.run(item);
        return {ok:resp.changes>0}
    },
    upsert(item){
        upsert_item.run(item);
        return {ok:true}
    },
    remove(id){
        delete_item.run(id);
        return {ok:true}
    }
}