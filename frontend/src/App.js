import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Signupage from "./pages/Signupage";
import Homepage from "./pages/Homepage";
import Productdetails from "./pages/Productdetails";
// import EditProduct from "./pages/EditProduct";
import EditProductpage from "./pages/EditProductpage";

function App() {
  return (
    <Routes>
    
      <Route path="/" element={<Signupage />} />
        <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<div>Forgot Password Page</div>} />
        <Route path="/home" element={<Homepage/>} />
        <Route path="/product/:id" element={<Productdetails/>}/>
  
<Route path="/product/:id/edit" element={<EditProductpage/>} />


    </Routes>
  );
}

export default App;
