import { useParams } from "react-router-dom"
import { Building2, HardHat, Hammer, Handshake } from "lucide-react";
import Loginlayout from "../layouts/LoginPageLayout"
export default function Login_form(){
    const { role } = useParams()

    const roles ={
        owner: {
            Dashboard_direct:'/Dashboard/owner',
            logo: Building2,
            name: 'Organization Owner',
            email_name: 'Owner Email',  
        },
        manager: {
            Dashboard_direct:'/Dashboard/owner',
            logo: HardHat,
            name: 'Project manager/contractor',
            email_name: 'Manager Email',  
        },
        worker: {
            Dashboard_direct:'/Dashboard/owner',
            logo: Hammer,
            name: 'Worker/subcontractor',
            email_name: 'Worker Email',  
        },
        client: {
            Dashboard_direct:'/Dashboard/owner',
            logo: Handshake,
            name: 'Client',
            email_name: 'Client Email',  
        },

    }
    console.log(roles.owner.Dashboard_direct)
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
        {role === 'client' && 
                <Loginlayout 
                Dashboard_direct={roles.client.Dashboard_direct} 
                logo={roles.client.logo}
                name={roles.client.name}
                email_name={roles.client.email_name}
                role="client"
                />}
    </section>
}