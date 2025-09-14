import {HashRouter,Routes,Route,Navigate} from "react-router-dom";
import './App.css'
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import ItemsMiddlePanel from "./components/Items/Items";
import Stats from "./components/Stats/Stats";

function App() {

  return (
   <HashRouter>
       <Routes>
           <Route path='/' element={<Navigate to='/login' replace/>}/>
           <Route path='/login' element={<Login/>}/>
           <Route path='/dashboard' element={<Dashboard/>}/>
           <Route path='/items' element={<ItemsMiddlePanel/>}/>
           <Route path='/stats' element={<Stats/>}/>
       </Routes>
   </HashRouter>
  )
}

export default App
