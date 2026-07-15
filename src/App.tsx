import { BrowserRouter, Routes, Route } from "react-router"
import Frontpage from "./pages/FrontPage"
import Login_form from "./pages/LoginPage"
import Dashboard from "./pages/Dashboard"
function App (){
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Frontpage />} />
        <Route path="/Login/:role" element={<Login_form />} />
        <Route path="/Dashboard/:role" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
