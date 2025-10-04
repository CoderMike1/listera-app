import itemPNG from '../../assets/item.png'
import {Bell} from 'lucide-react'
import './NotificationPanel.css'
import {useEffect, useState} from "react";
const NotificationPanel = () =>{

    const [notifications,setNotifications] = useState([])

    const reload = async ()=>{
        const resp = await window.notify.list()
        if(!resp.ok){
            throw new Error("cos tam elo")
        }
        else{
            setNotifications(resp.items.filter((i) => i.read === false))
        }
    }

    useEffect(() =>{
        reload()
    },[])


    // useEffect(() => {
    //
    //     (async () =>{
    //         await window.notify.add({level:"error",title:"Error while adding new listing",message:"abc Error while adding new listing Error while adding new listing"|| "null"});
    //         await window.notify.add({level:"error",title:"Error while adding new listing",message:"abc Error while adding new listing Error while adding new listing"|| "null"});
    //         await window.notify.add({level:"error",title:"Error while adding new listing",message:"abc Error while adding new listing Error while adding new listing"|| "null"});
    //         await window.notify.add({level:"error",title:"Error while adding new listing",message:"abc Error while adding new listing Error while adding new listing"|| "null"});
    //     })()
    //
    // }, []);


    const markAsRead = async (id) =>{
        const resp = await window.notify.markRead(id);
        await reload()
    }

    const daysAgo = (timestamp) =>{
        const sent = new Date(timestamp);

        const now = new Date();

        const sentMid = new Date(sent.getFullYear(), sent.getMonth(), sent.getDate());
        const nowMid  = new Date(now.getFullYear(),  now.getMonth(),  now.getDate());
        const MS_PER_DAY = 86400000;
        const result = Math.round((nowMid - sentMid) / MS_PER_DAY)
        if(result){
            return `${result} days ago`
        }
        else{
            return "today"
        }

    }

    return (
        <div className="np-container">

            <div className="np-header">
                <div className="np-header-icon">
                    <Bell size={38} />
                </div>
                <h2>Notifications ({notifications.length})</h2>
            </div>
            <div className="np-card">
                <ul className="np-list">

                    {notifications.map(k=>(
                        <li key={k.id} className="np-item">
                            <button className="np-item-close" onClick={()=>markAsRead(k.id)}>X</button>
                            <img className="np-thumb" src={itemPNG} width={50} height={50} alt="item"/>

                            <div className="np-item-body">
                                <span className="np-item-title">{k.title}</span>
                                <p className="np-item-desc">{k.message}</p>
                            </div>

                            <div className="np-tooltip" role="tooltip">
                                <strong className="np-tooltip-title">{k.title}</strong>
                                <p className="np-tooltip-text">{k.message}</p>
                            </div>

                            <time className="np-item-time">{daysAgo(k.createdAt)}</time>



                        </li>
                    ))}
                </ul>

            </div>

        </div>
    )

}


export default NotificationPanel

