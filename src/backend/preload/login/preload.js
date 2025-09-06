

const expose = ({contextBridge,ipcRenderer}) =>{
    contextBridge.exposeInMainWorld("login",{
        authorize:() => authorize(ipcRenderer)
    })

}

const authorize = (ipcRenderer) =>{

    const resp = ipcRenderer.invoke("login:api-authorize")

    return resp;


}


module.exports = {expose}