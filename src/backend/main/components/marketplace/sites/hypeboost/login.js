const cheerio = require('cheerio');
const { default: fetchCookie } = require('fetch-cookie');
const { CookieJar } = require('tough-cookie');

const login = async (login_hypeboost,password_hypeboost) =>{

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
        throw new Error("[l1] Error while getting login page...")
    }
    else{
        const content = await r1.text();

        const $ = cheerio.load(content)

        const token = $('input[name="_token"]').val();

        if(!token){
            throw new Error('[l2] payload is null...')
        }
        if(login_hypeboost === "" || password_hypeboost === ""){
            throw new Error("l[3] hypeboost credentials are empty...")
        }
        else{
            const login_payload = new URLSearchParams({
                _token:token,
                email:login_hypeboost,
                password:password_hypeboost,
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
                throw new Error("[l4] Error while logging account...")
            }
            else{
                if(p1.url === "https://hypeboost.com/en/login"){
                    throw new Error("[l5] Error while logging account...")
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