export async function get_members(){
    const res = await fetch('http://localhost:3000/total_members')
    return res
}