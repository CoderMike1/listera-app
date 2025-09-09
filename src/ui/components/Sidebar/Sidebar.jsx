import {NavLink} from "react-router-dom";
import helpPng from '../../assets/help.png'
import './Sidebar.css'

const Icon = ({d}) =>{
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
            <path d={d}/>
        </svg>
    )
}
const LINKS = [ { to: "/dashboard", label: "Dashboard", icon: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z", }, { to: "/items", label: "Items", icon: "M4 6h16v4H4V6Zm0 6h16v6H4v-6Zm3-3h4m-4 6h10", }, { to: "/stats", label: "Stats", icon: "M4 18h4V8H4v10Zm6 0h4V4h-4v14Zm6 0h4v-7h-4v7Z", }, { to: "/marketplace", label: "Marketplace", icon: "M4 7h16l-1.5 9.5A2 2 0 0 1 16.5 18h-9a2 2 0 0 1-1.98-1.7L4 7Zm3 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2", }, { to: "/settings", label: "Settings", icon: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.2-3.5a7.3 7.3 0 0 0-.1-1l2-1.5-2-3.4-2.3.7a7.2 7.2 0 0 0-1.7-1l-.3-2.4H9.2l-.3 2.4a7.2 7.2 0 0 0-1.7 1l-2.3-.7-2 3.4 2 1.5a7.3 7.3 0 0 0-.1 1c0 .35.03.7.1 1l-2 1.5 2 3.4 2.3-.7c.53.43 1.1.78 1.7 1l.3 2.4h5.4l.3-2.4c.6-.22 1.17-.57 1.7-1l2.3.7 2-3.4-2-1.5c.07-.33.1-.67.1-1Z", }, ];
const ICON_QUESTION = [
    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",                 // okrąg
    "M9.2 9.2a2.8 2.8 0 1 1 4.9 2c-.73.65-1.1.86-1.7 1.2-.6.35-.9.67-.9 1.5v.5",
    "M12 17h.01"                                                  // kropka
];
const Sidebar = () =>{

    return (
        <aside className="sidebar">
            <div className="sidebar__app-title">Listera</div>

            <nav className="sidebar__nav">
                {LINKS.map((l) => (
                    <NavLink
                        key={l.to}
                        to={l.to}
                        className={({ isActive }) =>
                            "navlink" + (isActive ? " is-active" : "")
                        }
                    >
                        <Icon d={l.icon} />
                        <span>{l.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar__foot">
                <div className="version">v0.0.1</div>
                <div className='help-part'>
                    <div className="help-part-image">
                        <img src={helpPng} alt='Help' width={20} height={20}/>
                    </div>
                    <div className="help-part-span">
                        <span>Help?</span>
                    </div>
                </div>
            </div>
        </aside>
    )


}

export default Sidebar

