import { useParams } from "react-router-dom"
import { Building2, HardHat, Hammer} from "lucide-react";
import Loginlayout from "../layouts/LoginPageLayout"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login_form(){
    const navigate = useNavigate()
    const { role } = useParams()
    const roles ={
        owner: {
            Dashboard_direct:'/Dashboard/owner',
            logo: Building2,
            name: 'Organization Owner',
            email_name: 'Owner Email',  
        },
        manager: {
            Dashboard_direct:'/Dashboard/manager',
            logo: HardHat,
            name: 'Project manager/contractor',
            email_name: 'Manager Email',  
        },
        worker: {
            Dashboard_direct:'/Dashboard/worker',
            logo: Hammer,
            name: 'Worker/subcontractor',
            email_name: 'Worker Email',  
        }
    }
    useEffect(() => {
        if (role === 'client') {
            navigate("/Dashboard/client-portal");
        }
    }, [role, navigate]);

    return<section>
        {role === 'owner' && 
            <Loginlayout 
            Dashboard_direct={roles.owner.Dashboard_direct} 
            logo={roles.owner.logo}
            name={roles.owner.name}
            email_name={roles.owner.email_name}
            role="owner"
            

            />}
        {role === 'manager' && 
                <Loginlayout 
                Dashboard_direct={roles.manager.Dashboard_direct} 
                logo={roles.manager.logo}
                name={roles.manager.name}
                email_name={roles.manager.email_name}
                role="manager"

                />}
        {role === 'worker' && 
                <Loginlayout 
                Dashboard_direct={roles.worker.Dashboard_direct} 
                logo={roles.worker.logo}
                name={roles.worker.name}
                email_name={roles.worker.email_name}
                role="worker"

                />}
    </section>
}