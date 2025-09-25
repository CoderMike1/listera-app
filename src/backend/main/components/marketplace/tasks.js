const path = require('path')
const {app} = require('electron')
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const CSV_HEADERS = [
    'id',
    'name',
    'size',
    'sku',
    'payout_price',
    'mode',
    'created_at'
]


const getCsvPath = () =>{
    const dir = app.getPath("userData");
    const file = path.join(dir, 'tasks.csv');
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
        id:String(r.id ?? ''),
        name:String(r.name ?? ''),
        size:String(r.size ?? ''),
        sku:String(r.sku ?? ''),
        payout_price:String(r.payout_price ?? ''),
        mode:String(r.mode ?? ''),
        created_at:String(r.created_at ?? '')
    }))
}
const addTask = (task)=>{
    const tasks = readTasks()
    const now = new Date().toISOString()

    const newTask = {
        id: task.id || cryptoRandomId(),
        name:task.name || '',
        size:task.size || '',
        sku: task.sku || '',
        payout_price: task.payout_price || '',
        mode: task.mode || '',
        created_at: now
    }

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
const deleteTask = (task_id) =>{
    const tasks = readTasks();
    const filtered = tasks.filter(t => t.id !== task_id);
    if (filtered.length === tasks.length) return false;
    writeTasks(filtered);
    return true;
}
const cryptoRandomId =()=> {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
module.exports = {ensureCsvExists,readTasks,addTask,deleteTask}