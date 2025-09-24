const cheerio = require('cheerio');
const { default: fetchCookie } = require('fetch-cookie');
const { CookieJar } = require('tough-cookie');

const login = async () =>{

    const jar = new CookieJar();
    const f = fetchCookie(global.fetch, jar);

    const r1 = await f("https://hypeboost.com/en/login",{
        method:"GET",
        headers:{
            "referer":"https://hypeboost.com/en",
            "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
        }
    })
    if(!r1.ok){
        throw new Error("sdsada")
    }
    else{
        const content = await r1.text();

        const $ = cheerio.load(content)

        const token = $('input[name="_token"]').val();

        if(!token){
            throw new Error('payload is null')
        }
        else{
            const login_payload = new URLSearchParams({
                _token:token,
                email:"mtest123@michasmail.com",
                password:"Szczupak123!",
            })

            const p1 = await f("https://hypeboost.com/en/login",{
                method:"POST",
                headers:{
                    "content-type":"application/x-www-form-urlencoded",
                    "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
                },
                body:login_payload
            })
            if(!p1.ok){
                throw new Error("proxy error p1")
            }
            else{
                if(p1.url === "https://hypeboost.com/en/login"){
                    console.log("error while logging in")
                }
                else{
                    const response_cookies = p1.headers.getSetCookie()

                    const xsrf_token = response_cookies.find(c => c.startsWith('XSRF-TOKEN=')).split(';')[0].split('=')[1];
                    const hypeboost_session = response_cookies.find(c => c.startsWith('hypeboost_session=')).split(';')[0].split('=')[1];

                    return f;
                }
            }


        }

    }


}

module.exports = {login}