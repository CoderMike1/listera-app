import {useEffect, useState} from "react";
import './SettingsMiddlePanel.css'

const SettingsMiddlePanel = () =>{

    const [hypeboostLogin, setHypeboostLogin] = useState("");
    const [hypeboostPassword,setHypeboostPassword] = useState("");

    const [isSaving,setIsSaving] = useState(false)


    useEffect(() => {
        const f = async ()=>{

            const {login_hypeboost,password_hypeboost} = await window.settings.api_get_hypeboost_credentials()

            setHypeboostLogin(login_hypeboost);
            setHypeboostPassword(password_hypeboost);
        }
        f()
    }, []);

    const submitChanges = async (e) =>{
        e.preventDefault()
        setIsSaving(true)

        const changes_form = {
            login_hypeboost:hypeboostLogin,
            password_hypeboost:hypeboostPassword
        }

        const resp = await window.settings.api_set_hypeboost_credentials(changes_form)

        setIsSaving(false);

    }




    return (

        <div className="mp-settings-container">
            <h2 className="settings-title">Settings</h2>
            <form onSubmit={submitChanges} className="mp-settings-form">
                <label>
                    <div>HypeBoost Login</div>
                    <input
                        value={hypeboostLogin}
                        onChange={e=>setHypeboostLogin(e.target.value)}
                        />
                </label>
                <label>
                    <div>HypeBoost Password</div>
                    <input
                        value={hypeboostPassword}
                        onChange={e=>setHypeboostPassword(e.target.value)}
                        />
                </label>
                <label>
                    <div>Currency (only EUR at the moment)</div>
                    <input
                        defaultValue="EUR"
                        disabled
                    />
                </label>

                <div className="mp-settings-buttons">
                    <button className="btn btn-primary" type="submit">
                        {!isSaving ? "Save" : "Saving..."}
                    </button>
                </div>

            </form>


        </div>
    )

}

export default SettingsMiddlePanel