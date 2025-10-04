
const {login} = require("./login")
const {addListing} = require("./addListing")
const {deleteListing} = require('./deleteListing')



const add_listing = async (sku,size,payout_price,minimum_price,stock,login_hypeboost,password_hypeboost)=>{

    const f = await login(login_hypeboost,password_hypeboost);

    return await addListing(f,sku,size,payout_price,minimum_price,stock)
}

const delete_listing = async(listing_id,login_hypeboost,password_hypeboost) =>{
    const f = await login(login_hypeboost,password_hypeboost)

    return await deleteListing(f,listing_id)
}


module.exports = {add_listing,delete_listing}