type Manager_Details = {
    name:string,
    email: string,
}

export async function AddManager(details:Manager_Details){
   try{
        const res = await fetch("http://localhost:3000/addManager",{
            method:'POST',
            headers :{'Content-Type':'application/json'},
            body:JSON.stringify(details)
        })

        console.log(details)
        if(!res.ok){
            throw new Error("Failed to Add Manager")
        }
   }catch(err){
        console.log(err)
   }
}