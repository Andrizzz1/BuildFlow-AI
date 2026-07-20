export async function OwnerDb(
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
        created_at:string
    }){
    
    const res =  await fetch("http://localhost:3000/projects",{
        method:"POST",
        headers :{'Content-Type':'application/json'},
        body:JSON.stringify(details)
      })
}