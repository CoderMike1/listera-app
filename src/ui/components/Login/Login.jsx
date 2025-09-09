import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import './Login.css'


const Login = () =>{

    const [loading,setLoading] = useState(false)
    const [status,setStatus] = useState(null)
    const navigate = useNavigate()

    const handleAuthorize = async () =>{
        setLoading(true)
        setStatus(null)

        try{
            const authorize = window.login.authorize;
            if(typeof authorize !== 'function'){
                throw new Error('IPC API window.api.login.authorize is not available');
            }
            const res = await authorize();

            if(res?.ok){
                setStatus('success')
                navigate('/dashboard',{replace:true})
            }
            else{
                setStatus('error')
            }

        }
        catch(e){
            console.error(e)
        }
        finally {
            setLoading(false)
        }

    }

    return (
        <div className='login-page'>
            <div className="app-brand">
                <h1 className="app-title">Listera App</h1>
                <span className="app-version">v 0.0.1</span>
            </div>
            <button
                className='login-btn'
                onClick={handleAuthorize}
                disabled={loading}
                aria-busy={loading}
            >
                {loading ? 'Authorizing...' : 'Login'}
            </button>

            {status && (
                <p className={`login-status ${status}`}>
                    {status === 'success' ? 'Authorized ✅' : 'Authorization failed ❌'}
                </p>
            )}

        </div>
    )

}

export default Login

