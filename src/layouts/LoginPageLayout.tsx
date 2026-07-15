import {ArrowLeft,Mail,LogIn, } from "lucide-react";
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
    return <section>
        <nav className="flex gap-1">
            <ArrowLeft />
            <p>PORTAL SELECT</p>
        </nav>

        {/*Contents */}
        <div>
            <div>
                <p className="upper">Executive Control</p>
                <div className="flex gap-1">
                     <Logo />
                     <h1>{name}</h1>
                </div>
            </div>

            <div>
                <form action={handleSubmit}>
                     <p className="upper">//Credentials</p>

                     <label htmlFor="email">{email_name }</label>
                     <div id="email">
                        <Mail />
                        <input type="text" placeholder="you@gmail.com"/>
                     </div>

                     <label htmlFor="password">Password</label>
                     <div id="password">
                        <Mail />
                        <input type="text" placeholder="••••••••••••"/>
                     </div>
                    
                    <button>Sign In <LogIn /> </button>
                </form>
            </div>
        </div>
    </section>
}