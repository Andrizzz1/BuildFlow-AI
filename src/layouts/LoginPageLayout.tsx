import {ArrowLeft,Mail,LogIn,Lock  } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
type LoginPageProps={
    Dashboard_direct: string
    logo: LucideIcon
    name:string
    email_name: string  
}
export default function Loginlayout({Dashboard_direct,logo:Logo,name, email_name}:LoginPageProps){
    const navigate = useNavigate()

    function handleSubmit(){
        navigate(`${Dashboard_direct}`)
    }
    return <section className="px-20">
        <nav >
            <div onClick={()=>{navigate('/')}} className="flex gap-1 cursor-pointer p-1">
                <ArrowLeft />
                <p>PORTAL SELECT</p>
            </div>
            
        </nav>

        {/*Contents */}
        <div className="grid lg:grid-cols-2 min-h-screen">
            <div className="h-60 flex flex-col justify-end">
                <p className="uppercase text-6xl">Executive Control</p>
                <div className="flex gap-1">
                     <Logo color="gray" />
                     <h1 className="text-gray-500">{name}</h1>
                </div>
            </div>

            <div className="h-96 flex flex-col items-center justify-end">
                <form action={handleSubmit} className="border border-gray-600 p-20 rounded-md">
                     <p className="uppercase text-lg text-gray-600">//Credentials</p>

                     <label htmlFor="email" className="uppercase text-xs">{email_name }</label>
                     <div id="email" className="border border-gray-300 rounded-md px-3 py-2 focus-within:border-blue-500 flex items-center gap-1">
                        <Mail size={20} />
                        <input className=" outline-none" type="text" placeholder="you@gmail.com"/>
                     </div>

                     <label htmlFor="password" className="text-xs uppercase">Password</label>
                     <div id="password" className="border border-gray-300 rounded-md px-3 py-2 focus-within:border-blue-500  flex items-center gap-1">
                        <Lock size={20} />
                        <input className="outline-none"  type="text" placeholder="••••••••••••"/>
                     </div>
                    <div className="flex justify-center mt-2">
                        <button className="flex items-center cursor-pointer">Sign In <LogIn size={20} /> </button>
                    </div>
                   
                </form>
            </div>
        </div>
    </section>
}