const cheerio = require("cheerio");


const addListing = async (f,sku,size,payout_price,minimum_price) =>{

    console.log("adding new listing...")

    const {size_id, product_id, token, lowest_price, product_image, product_link} = await getSizeInfo(f,sku,size);


    const lowest_payout = await calculatePayout(f,token,lowest_price);

    let listing_price;
    let listing_payout;

    if(payout_price.toUpperCase() === "LP"){
        if(lowest_payout >= Number(minimum_price)){
            // leci lowest ask
            listing_price = await calculateFullPrice(f,token,lowest_payout);
            listing_payout = lowest_payout;
        }
        else{
            //leci minimum price
            listing_price = await calculateFullPrice(f,token,Number(minimum_price));
            listing_payout = minimum_price
        }
    }
    else{
        if(lowest_payout >= Number(payout_price)){
            //leci lowest ask
            listing_price = await calculateFullPrice(f,token,lowest_payout)
            listing_payout = lowest_payout
        }
        else{
            //leci price
            listing_price = await calculateFullPrice(f,token,Number(payout_price))
            listing_payout = payout_price
        }
    }

    const p_body = new URLSearchParams({
        _token:token,
        price:listing_price,
        size_id:size_id,
        listing_duration:"30",
        payout:listing_payout,
        accept_new_unworn:true,
        accept_ship_or_fine:true,
        accept_no_vat_deduction:true,
        accept_return_and_payout:true
    })

    const p1 = await f(`${product_link}/confirm`,{
        method:"POST",
        headers:{
            "accept": "*/*",
            "x-requested-with": "XMLHttpRequest",
            "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
        },
        body:p_body
    })

    if(!p1.ok){
        throw new Error("error while adding new item")
    }
    const text_json = await p1.json()
    const check = text_json["success"];
    if(check){
        const listing_id = await getListingId(f,product_id,size_id,listing_price)
        return {payout_price:listing_payout,listing_price:listing_price,listing_id:listing_id,site:"HypeBoost"}
    }
}


const getListingId = async (f,product_id,size_id,listing_price) =>{
    let flag = false;
    let page = 1;
    while(!flag){
        const r1 = await f(`https://hypeboost.com/en/account/sales/current?p=${page}`,{
            method:"GET",
            headers:{
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
            }
        })
        if(!r1.ok){
            throw new Error("sada")
        }
        else{
            const content = await  r1.text()

            const $ = cheerio.load(content)

            const listings = $('div.grid-row').toArray();

            if(listings.length === 0){
                flag= true;
                return null;
            }

            for(const el of listings){
                const $el = $(el);

                const listing_size_id =
                    $el.find('input.sizeid').attr('value') ?? '';

                const listing_full_price =
                    $el.find('input.price').attr('value') ?? '';

                const listing_base_product_id =
                    $el.find('input.baseproductid').attr('value') ?? '';

                if(listing_size_id === size_id && listing_full_price === String(listing_price) && listing_base_product_id === product_id){

                    return $el.find('input.productid').attr('value') ?? ''

                }
            }

            page +=1
        }


    }


}


const getSizeInfo = async (f,sku,size) => {

    //get size info

    const r1 = await f(`https://hypeboost.com/en/search/sell?keyword=${sku}`, {
        method: "GET",
        headers: {
            "accept": "*/*",
            "x-requested-with": "XMLHttpRequest",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
        }
    })
    if (!r1.ok) {
        throw new Error("r1 error")
    }
    const content = await r1.text()

    const $ = cheerio.load(content)

    const product_link = $("a").attr('href')

    const product_image = $("div.image img").attr("src") ||
        $("div.search__result__product__image img").attr("src") || null;

    const product_sku = $("span.grey").text().trim() ||
        $("div.search__result__product__info").attr("p").text().trim()

    if (product_sku && product_sku !== sku) {
        throw new Error("sku not found")
    }


    const r2 = await f(product_link, {
        method: "GET",
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
        }
    })
    if (!r2.ok) {
        throw new Error("proxy error r2")
    }
    const text = await r2.text()
    console.log(text)

    const $p = cheerio.load(text);
    let product_id = null;
    $p('script').each((i, el) => {
        const content = $p(el).html();
        if (!content) return;

        const lines = content.trim().split(/\r?\n/);
        if (lines[0]?.trim() === 'var sellSearching = null;') {
            const m = content.match(/url:\s*'(\/product\/get-lowest-price\/[^']+)'/);
            if (m) product_id = m[1].split('/')[3] || null;
        }
    });

    const token = $p('input[name="_token"]').attr('value') || '';

    const sizes_list = $p('#size_id option')
        .map((i, el) => ({
            value: $p(el).attr('value') || '',
            text: $p(el).text().trim(),
        }))
        .get();

    let size_id = null;

    const match = sizes_list.find(x => correctFormatFromFraction(x.text) === size)

    if(!match){
        throw new Error("size not found")
    }
    size_id = match.value;

    const lowest_price = await getLowestPrice(f, product_id, size_id);

    return {
        size_id: size_id,
        product_id: product_id,
        token: token,
        lowest_price: lowest_price,
        product_image: product_image,
        product_link: product_link
    }
}


function correctFormatFromFraction(str = '') {
    const map = {
        '½': '.5',
        '⅓': '1/3',
        '⅔': '2/3',
        '¼': '1/4',
        '¾': '3/4',
        '⅕': '1/5',
        '⅖': '2/5',
        '⅗': '3/5',
        '⅘': '4/5',
        '⅙': '1/6',
        '⅚': '5/6',
        '⅐': '1/7',
        '⅛': '1/8',
        '⅜': '3/8',
        '⅝': '5/8',
        '⅞': '7/8',
        '⅑': '1/9',
        '⅒': '1/10'
    };

    let out = String(str);
    for (const [unicodeFraction, asciiFraction] of Object.entries(map)) {
        if (out.includes(unicodeFraction)) {
            if (asciiFraction === '.5') {
                out = out.split(unicodeFraction).join(asciiFraction);
                out = out.replace(/\s+/g, '');
            } else {
                out = out.split(unicodeFraction).join(asciiFraction);
                out = out.replace(/\s{2,}/g, ' ');
            }
        }
    }
    return out;
}

const getLowestPrice = async (f,product_id,size_id) =>{

    const r1 = await f(`https://hypeboost.com/en/product/get-lowest-price/${product_id}/${size_id}`,{
        method:"GET",
        headers:{
            "accept": "*/*",
            "x-requested-with": "XMLHttpRequest",
            "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
        }
    })
    if(!r1.ok){
        throw new Error("r1 proxy error")
    }
    else{
        const text = await r1.text();
        const price = Number(text);

        if(Number.isNaN(price)){
            throw new Error("invalid price response")
        }

        return price;
    }




}

const calculatePayout = async (f,token,price) =>{

    const body = new URLSearchParams({
        _token: token,
        price: price
    })

    const p1 = await f("https://hypeboost.com/en/payout",{
        method:"POST",
        headers:{
            "accept": "*/*",
            "x-requested-with": "XMLHttpRequest",
            "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
        },
        body:body
    })
    const text = await p1.text();

    const $ = cheerio.load(text);

    let percentage = 0.085;
    const processingTd = $("td").filter((i,el) =>{
        const txt = $(el).text();
        return txt && txt.includes("Processing fee")
    }).first()

    if(processingTd.length){
        const txt = processingTd.text();

        const m = txt.match(/\(([\d.,]+)\s*%\)/);
        if (m) {
            const val = parseFloat(m[1].replace(',', '.'));
            if (!Number.isNaN(val)) percentage = val / 100;
        }
    }
    let operational_fee_value = null;
    const firstTd = $('td').first();
    if (firstTd.length) {
        const opTxt = firstTd.next().next().text().trim();

        const cleaned = opTxt
            .replace(/^Operational fee\s*-\s*€\s*/i, '')
            .replace(/\s/g, '')
            .replace(',', '.');
        const num = parseFloat(cleaned);
        if (!Number.isNaN(num)) operational_fee_value = num;
    }

    const result = Math.round((price - (price * percentage) -15) * 100 ) / 100;

    return result;


}

const calculateFullPrice = async (f,token,price) =>{
    const body = new URLSearchParams({
        _token: token,
        price: price
    })
    const p1 = await f("https://hypeboost.com/en/payout",{
        method:"POST",
        headers:{
            "accept": "*/*",
            "x-requested-with": "XMLHttpRequest",
            "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
        },
        body:body
    })
    const text = await p1.text();

    const $ = cheerio.load(text);

    let percentage = 0.085;
    const processingTd = $("td").filter((i,el) =>{
        const txt = $(el).text();
        return txt && txt.includes("Processing fee")
    }).first()

    if(processingTd.length){
        const txt = processingTd.text();

        const m = txt.match(/\(([\d.,]+)\s*%\)/);
        if (m) {
            const val = parseFloat(m[1].replace(',', '.'));
            if (!Number.isNaN(val)) percentage = val / 100;
        }
    }
    let operational_fee_value = 15;
    // const firstTd = $('td').first();
    // if (firstTd.length) {
    //     const opTxt = firstTd.next().next().text().trim();
    //
    //     const cleaned = opTxt
    //         .replace(/^Operational fee\s*-\s*€\s*/i, '')
    //         .replace(/\s/g, '')
    //         .replace(',', '.');
    //     const num = parseFloat(cleaned);
    //     if (!Number.isNaN(num)) operational_fee_value = num;
    // }

    const result =Math.round((price+operational_fee_value) / (1-percentage))

    return result;
}

module.exports = {addListing}