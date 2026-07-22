export async function CreateProject(
    details: {
        name:string,
        description:string,
        location:string,
        assigned_manager:string,
        assigned_client:string,
        start_date:string,
        finish_date:string,
        budget:number,
        status: 'planning'|'active'|'on_hold'|'completed'|'cancelled'
    }){
    
    try{
        const res =  await fetch("http://localhost:3000/projects",{
            method:"POST",
            headers :{'Content-Type':'application/json'},
            body:JSON.stringify(details)
        })

        if (!res.ok){
            throw new Error("Failed to create project");
        }

    }catch(error){
        console.log(error)
    }
}