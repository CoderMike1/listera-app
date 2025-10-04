const cheerio = require("cheerio");

const deleteListing = async (f,listing_id) =>{

    const r = await f("https://hypeboost.com/en/account/sales/current?p=1",{
        method:"GET",
        headers:{
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
        }
    })

    if(!r.ok){
        throw new Error("d[1] Error while loading site...")
    }
    const content = await r.text()
    const $ = cheerio.load(content)

    const token = $('input[name="_token"]').val();
    const delete_payload = new URLSearchParams({
        "_token":token
    })

    const p = await f(`https://hypeboost.com/en/account/sales/current/${listing_id}/delete`,{
        method:"POST",
        headers:{
            "accept": "*/*",
            "x-requested-with": "XMLHttpRequest",
            "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
        },
        body:delete_payload
    })

    if(!p.ok){
        throw new Error("d[2] Error while deleting listing...")
    }
    return {ok:true}
}

module.exports = {deleteListing}