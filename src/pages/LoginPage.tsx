import { useParams } from "react-router-dom"

export default function Login_form(){
    const { role } = useParams()
    console.log(role)
    return<section>
        <h1>role: {role}</h1>
        {role === 'owner' && <h1>Hello Owner</h1>}
        {role === 'manager' && <h1>Hello manager</h1>}
        {role === 'worker' && <h1>Hello worker</h1>}
        {role === 'client' && <h1>Hello client</h1>}
    </section>
}