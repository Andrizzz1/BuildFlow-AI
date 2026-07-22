import toast from "react-hot-toast";
export async function useLogin(userdetails :{email:string,password:string,role:string}) {
      const res = await fetch("http://localhost:3000/validation",{
        method:"POST",
        headers :{'Content-Type':'application/json'},
        body:JSON.stringify(userdetails)
      })

    if(!res.ok){
       toast.error("Invalid email or password");
    
    }

    const data = await res.json();
    // e.g. save a token so future requests know you're logged in
    localStorage.setItem("token", data.token);
    return data.user
  }
