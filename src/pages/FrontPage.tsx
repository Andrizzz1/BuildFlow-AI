import logo from '../assets/logo.png'
import background from '../assets/background.png' 
import PortalCard from '../components/PortalOptionCard'
import { Building2, HardHat, Hammer, Handshake } from "lucide-react";
export default function Frontpage(){
    return<section className='min-h-screen bg-no-repeat bg-center bg-cover p-4' style={{backgroundImage:`url(${background})`}}>

        <nav className='flex items-center z-10'>
            <img src={logo} alt="Logo" className='w-13'/>   
            <h1 className='font-bold text-xl text-[#033363]'>BuildFlow AI</h1> 
        </nav>
        {/*Contents */}
        <div className='flex flex-col items-center justify-center md:h-[75vh] max-sm:mt-5 '>
            <h2 className='font-bold text-2xl md:text-4xl text-[#033363] '>Select a Portal</h2>
            <p className='text-gray-700 max-sm:text-sm md:w-2xl mb-5'>Access your specialized tools and real-time project data from the centralized BuildFlow AI insfrastructure suite.</p>

                {/*Portal Options */}
            <div className='grid grid-cols-2 gap-5 max-sm:grid-cols-1 '>
                <PortalCard logo={Building2}
                            name = 'Oranization owner' 
                            desc = 'Manage your company, projects, users, budgets, and overall construction operations.' 
                            link = '/Login/owner'/>

                <PortalCard logo={HardHat}
                            name = 'Project manager/contractor' 
                            desc = 'Plan projects, assign tasks, monitor progress, approve reports, and track expenses.' 
                            link = '/Login/manager'/>

                <PortalCard logo={Hammer}
                            name = 'Worker/subcontractor' 
                            desc = 'View assigned tasks, submit daily progress, report issues, and communicate with managers.' 
                            link = '/Login/worker'/>
                <PortalCard logo={Handshake}
                            name = 'Client' 
                            desc = 'Track project progress, review approved updates, view milestones, and contact the project team.' 
                            link = '/Login/client'/>
            </div>
        </div>

        </section>
}