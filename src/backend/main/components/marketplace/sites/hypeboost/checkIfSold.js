// const {login} = require("./login");
// const {getHypeBoostCredentials} = require("../../../settings");


const {buildNotif, persist, broadcast} = require("../../../notifications/notifications-db");
const checkIfSold = async () =>{
    // const {login_hypeboost,password_hypeboost} = await getHypeBoostCredentials()
    // const f = await login(login_hypeboost,password_hypeboost);

    // console.log("siema")
    // await new Promise(r => setTimeout(r, 10000));
    //
    //
    // const notif = buildNotif({level:"info",title:"Item has been sold",message:"Successfully sold abcd item"});
    // persist(notif);
    // broadcast("notifications_api:new",notif)

}


module.exports = {checkIfSold}