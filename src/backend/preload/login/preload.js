

const expose = ({contextBridge,ipcRenderer}) =>{
    contextBridge.exposeInMainWorld("login",{
        authorize:() => authorize(ipcRenderer)
    })

}

const authorize = (ipcRenderer) =>{

    return  ipcRenderer.invoke("login:api-authorize")


}


module.exports = {expose}