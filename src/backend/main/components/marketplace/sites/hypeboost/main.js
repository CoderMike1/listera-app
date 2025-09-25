
const {login} = require("./login")
const {addListing} = require("./addListing")


const main = async ()=>{

    const f = await login()

    await addListing(f)

}

main()