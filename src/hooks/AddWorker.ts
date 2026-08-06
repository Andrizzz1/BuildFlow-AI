type worker = {
    name:string
    email: string
}

export async function AddWorker(details:worker){
    try{
        const res = await fetch("http://localhost:3000/addWorker",{
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