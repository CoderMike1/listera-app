const cheerio = require("cheerio");

const sku = "DZ7293-100"
const size = "45"
const payout_price = "199"

const addListing = async (f) =>{

    console.log("adding new listing...")





}



const getSizeInfo = async (f) =>{

    //get size info

    const r1 = await f(`https://hypeboost.com/en/search/sell?keyword=${sku}`,{
        method:"GET",
        headers:{
            "accept":"*/*",
            "x-requested-with": "XMLHttpRequest",
            "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
        }
    })
    if(!r1.ok){
        throw new Error("r1 error")
    }
    else{
        const content = await r1.text();

        const $ = cheerio.load(content)

        const product_link = $("a").attr('href')

        let product_image;

        try{
            product_image = $("div.image img").attr("src")
        }
        catch{
            try{
                product_image = $('div.search__result__product__image img').attr("src")
            }
            catch{
                product_image = null;
            }
            finally {

            }
        }
        finally {
            let product_sku="";
            try{
                product_sku = $('span.gray').text().trim()
            }
            catch{
                product_sku = $('div.search__result__product__info').attr('p').text().trim()
            }
            finally {
                if(product_sku !== sku){
                    throw new Error("sku not found")
                }
                else{

                    const r2 = await f(product_link,{
                        method:"GET",
                        headers:{
                            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                            "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
                        }
                    })
                    if(!r2.ok){
                        throw new Error("proxy error r2")
                    }
                    else{
                        const $ = cheerio.load(r2.text());

                        let product_id = null;
                        $('script').each((i, el) => {
                            const content = $(el).html();
                            if (!content) return;

                            const lines = content.trim().split(/\r?\n/);
                            if (lines[0]?.trim() === 'var sellSearching = null;') {
                                const m = content.match(/url:\s*'(/product\/get-lowest-price\/[^']+)'/);
                                if (m) {
                                    product_id = m[1].split('/')[3] || null;
                                }
                            }
                        });

                        const token = $('input[name="_token"]').attr('value') || '';

                        const sizes_list = $('#size_id option')
                            .map((i, el) => ({
                                value: $(el).attr('value') || '',
                                text: $(el).text().trim(),
                            }))
                            .get();

                        const size_id = null;
                    }


                }
            }
        }





    }



}