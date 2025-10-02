const path = require('path')
const {app} = require('electron')
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const CSV_HEADERS = [
    'id',
    'listing_id',
    'name',
    'size',
    'stock',
    'sku',
    'payout_price',
    'listing_price',
    'mode',
    'status',
    'site',
    'created_at'
]
const getCsvPath = () =>{
    const dir = app.getPath("userData");
    const file = path.join(dir, 'listings.csv');
    return file;
}

const ensureCsvExists = () =>{
    const file = getCsvPath();
    if(!fs.existsSync(file)){
        const headerLine = CSV_HEADERS.join(',')+'\n';
        fs.writeFileSync(file,headerLine,'utf8')
    }
}

const readTasks = () =>{
    const file = getCsvPath();
    const content = fs.readFileSync(file,'utf8');

    if(!content.trim() || content.trim() === CSV_HEADERS.join(',')) return []

    const records = parse(content, {
        columns:true,
        skip_empty_lines:true,
    })
    return records.map(r => ({
        id: String(r.id ?? ''),
        listing_id:   String(r.listing_id ?? '' ),
        name:         String(r.name ?? ''),
        size:         String(r.size ?? ''),
        stock:        String(r.stock ?? ''),                    // new
        sku:          String(r.sku ?? ''),
        payout_price: String(r.payout_price ?? ''),
        listing_price:String(r.listing_price ?? r.price ?? ''), // new
        mode:         String(r.mode ?? ''),
        status:       String(r.status ?? ''),
        site : String(r.site ?? ''),
        created_at:   String(r.created_at ?? r.createdAt ?? '')
    }));
}
const addTask = (task)=>{
    const tasks = readTasks()
    const now = new Date().toISOString()

    const newTask = {
        id: String(task.id ?? ''),
        listing_id:    String(task.listing_id ?? ''),
        name:          String(task.name ?? ''),
        size:          String(task.size ?? ''),
        stock:         String(task.stock ?? ''),
        sku:           String(task.sku ?? ''),
        payout_price:  String(task.payout_price ?? ''),
        listing_price: String(task.listing_price),
        mode:          String(task.mode ?? ''),
        status:        String(task.status ?? ''),
        site: String(task.site ?? ''),
        created_at:    String(task.created_at ?? now ?? new Date().toISOString())
    };

    tasks.push(newTask)

    writeTasks(tasks)

    return newTask


}

const writeTasks = (tasks) =>{
    const csv = stringify(tasks, {
        header: true,
        columns: CSV_HEADERS
    });

    fs.writeFileSync(getCsvPath(), csv, 'utf8');
}

const updateTask = () =>{
}
const deleteTask = (task_listing_id) =>{
    const tasks = readTasks();
    const filtered = tasks.filter(t => t.listing_id !== task_listing_id);
    if (filtered.length === tasks.length) return false;
    writeTasks(filtered);
    return true;
}

module.exports = {ensureCsvExists,readTasks,addTask,deleteTask}