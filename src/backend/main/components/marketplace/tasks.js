const path = require('path')
const {app} = require('electron')
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const CSV_HEADERS = [
    'id',
    'name',
    'size',
    'sku',
    'payout_price',
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
        created_at:String(r.created_at ?? '')
    }))
}
const addTask = ()=>{
}
const updateTask = () =>{
}
const deleteTask = () =>{
}

module.exports = {ensureCsvExists,readTasks}