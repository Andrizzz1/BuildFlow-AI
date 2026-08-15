import { BrowserRouter, Routes, Route } from "react-router"
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./components/AuthContext";
import Frontpage from "./pages/FrontPage"
import Login_form from "./pages/LoginPage"
import Owner_Dashboard from "./pages/OwnerDashboard"
import Manager_Dashboard from "./pages/ManagerDashboard";
import Worker_Dashboard from "./pages/WorkerDashboard";
import Client_Dashboard from "./pages/ClientDashboard";
import MenuLayout from "./layouts/menuLayout";
import Projects from "./pages/Projects";
import Clients from "./pages/Clients";
import Workers from "./pages/Workers";
import Messages from "./pages/Messenges";
import Managers from "./pages/Managers";
import ClientAuthPage from "./pages/client_portal";
import ChangePasswordPage from "./pages/changePassword";
function App (){
  return (
     <AuthProvider>
    <BrowserRouter>
      <Toaster position="top-center" />
        <Routes>
          <Route index element={<Frontpage />} />
          <Route path="/Login/:role" element={<Login_form />} />
          <Route element={<MenuLayout/>}>
            <Route path="/Dashboard/:role" element={<Owner_Dashboard />} />
            <Route path="/Dashboard/Projects" element={<Projects/>} />
            <Route path="/Dashboard/Clients" element={<Clients />} />
            <Route path="/Dashboard/Workers" element={<Workers />} />
            <Route path="/Dashboard/Messages" element={<Messages />} />
            <Route path="/Dashboard/Managers" element={<Managers />} />
          </Route>
          
          <Route path="/Dashboard/manager" element={<Manager_Dashboard />} />
          <Route path="/Dashboard/worker" element={<Worker_Dashboard />} />
          <Route path="/Dashboard/client" element={<Client_Dashboard/>} />
          <Route path="/Dashboard/client-portal" element={<ClientAuthPage />} />
          <Route path="/Change-password" element={<ChangePasswordPage  />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App
