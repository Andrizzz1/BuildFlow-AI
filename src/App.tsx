import { BrowserRouter, Routes, Route } from "react-router"
import { Toaster } from "react-hot-toast";
import Frontpage from "./pages/FrontPage"
import Login_form from "./pages/LoginPage"
import Owner_Dashboard from "./pages/OwnerDashboard"
function App (){
  return (
    <BrowserRouter>
     <Toaster position="top-center" />
      <Routes>
        <Route index element={<Frontpage />} />
        <Route path="/Login/:role" element={<Login_form />} />
        <Route path="/Dashboard/:role" element={<Owner_Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
