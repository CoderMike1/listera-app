
const cheerio = require('cheerio')

const getProductData = async (query) =>{

    let auth_token = ""

    while(true){
        const params = new URLSearchParams({
            search:query
        })
        const r = await fetch(`https://fulltrace-server.onrender.com/api/products?${params}`,{
            method:"GET",
            headers:{
                "accept":"*/*",
                "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
                "authorization":`Bearer ${auth_token}`
            }
        })


        if(!r.ok){

            const payload = new URLSearchParams({
                grant_type:"refresh_token",
                refresh_token:"AMf-vBwvzuEoCQ4ZV92vT2n1SGyvmgEM6uQSyL9sVcJe-m_s3O4RU_MWA_FvO3QQHLMlHDhIsiNJZeGo0ovGglBXFA82KaEq-F_NUwF4vzzE_4k-7sdKZkhgjZvjyMqm8qxGwkm4lRXTwIJkbg88Qe8eyhTALoSb9NE5auEV832i3NYBVEMmx7hbegKvRwmk93kWPriGGmxnU6864-_xY1JyG9AMZCK2OQ"
            })

            const resp = await fetch(`https://securetoken.googleapis.com/v1/token?key=AIzaSyBH1NS5RuSMLekpp-SUrQCVa-cDbErzpo4`,{
                method:"POST",
                headers:{
                    'accept': '*/*',
                    'accept-encoding': 'gzip, deflate, br, zstd',
                    'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
                    'content-type': 'application/x-www-form-urlencoded',
                    'origin': 'https://sell.tnsky.cz',
                    'priority': 'u=1, i',
                    'referer': 'https://sell.tnsky.cz/',
                    'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'cross-site',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
                    // 'x-browser-channel': 'stable',
                    // 'x-browser-copyright': 'Copyright 2025 Google LLC. All rights reserved.',
                    // 'x-browser-validation': 'DTaAFOAcbbd2xIkIWiLdbtAAhQc=',
                    // 'x-browser-year': '2025',
                    // 'x-client-data': 'CJG2yQEIprbJAQipncoBCLbpygEIk6HLAQiRpMsBCIWgzQEI0ofPAQiNjs8BCO6OzwE=',
                    // 'x-client-version': 'Chrome/JsCore/8.10.1/FirebaseCore-web',
                },
                body:payload
            })

            if(!resp.ok){
                throw new Error()
            }
            const json = await resp.json()
            auth_token = json.access_token;
            continue
        }
        const content = await r.json()
        let results = []
        const products = content.data.products;
        for(const p of products.slice(0,5)){
            const product_name = p.title;
            const product_image = p.image;
            const product_sku = p.sku;

            results.push({product_name:product_name,product_image:product_image,product_sku:product_sku})
        }

        return results;
    }



}

module.exports = {getProductData}