import { Routes,Route } from "react-router-dom";

import Home from "../pages/Home";
import CalculatorPage from "../pages/CalculatorPage";
import Categories from "../pages/Categories";
import History from "../pages/History";
import About from "../pages/About";

export default function AppRoutes(){

 return(

  <Routes>

   <Route path="/" element={<Home/>}/>
   <Route path="/calculator/:type" element={<CalculatorPage/>}/>
   <Route path="/categories" element={<Categories/>}/>
   <Route path="/history" element={<History/>}/>
   <Route path="/about" element={<About/>}/>

  </Routes>

 );

}