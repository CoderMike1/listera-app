
const {login} = require("./login")
const {addListing} = require("./addListing")


const main = async (sku,size,payout_price,minimum_price)=>{

    const f = await login()

    await addListing(f,sku,size,payout_price,minimum_price)

}


const add_listing = async (sku,size,payout_price,minimum_price)=>{

    const f = await login();

    return await addListing(f,sku,size,payout_price,minimum_price)

}


module.exports = {add_listing}