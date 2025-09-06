import {HashRouter,Routes,Route,Navigate} from "react-router-dom";
import './App.css'
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";

function App() {

  return (
   <HashRouter>
       <Routes>
           <Route path='/' element={<Navigate to='/login' replace/>}/>
           <Route path='/login' element={<Login/>}/>
           <Route path='/dashboard' element={<Dashboard/>}/>
       </Routes>
   </HashRouter>
  )
}

export default App
