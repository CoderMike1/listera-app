import itemPNG from '../../assets/item.png'
import {Bell} from 'lucide-react'
import './NotificationPanel.css'
import {useEffect, useState} from "react";
const NotificationPanel = () =>{

    const [notifications,setNotifications] = useState([])


    useEffect(() =>{

        const r1 = async () =>{

            const resp = await window.notifications.api_get_all_notifications()
            if(!resp.ok){
                throw new Error("cos tam elo")
            }
            else{
                setNotifications(resp.results)
            }

            }
        r1()

    })



    return (
        <div className="np-container">

            <div className="np-header">
                <div className="np-header-icon">
                    <Bell size={38} />
                </div>
                <h2>Notifications (0)</h2>
            </div>
            <div className="np-card">
                <ul className="np-list">

                    {notifications.map(k=>(
                        <li key={k.id} className="np-item">
                            <img className="np-thumb" src={itemPNG} width={50} height={50} alt="item"/>

                            <div className="np-item-body">
                                <span className="np-item-title">{k.title}</span>
                                <p className="np-item-desc">{k.description}</p>
                            </div>
                            <time className="np-item-time">3 days ago</time>
                        </li>
                    ))}
                </ul>

            </div>

        </div>
    )

}


export default NotificationPanel

