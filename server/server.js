import express from 'express'
import cors from 'cors'
import bcrypt from "bcrypt";
import pg from 'pg'
import "dotenv/config";
import jwt from "jsonwebtoken"
const app = express()
const PORT = 3000
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors())
const db = new pg.Client({
  user:'postgres',
  host:'localhost',
  database:'Construction Management',
  password:'123',
  port:5432
})

db.connect()

app.post('/validation',async (req,res)=>{
    const {email,password,role} = req.body
    const user = await db.query("SELECT * FROM users WHERE email = $1 AND role = $2",[email,role])
    console.log(user)
    console.log(password)
    try{
        if (!user.rows[0]) {
            console.log("no user")
            throw new Error("Invalid email or password");
        }
        const valid = await bcrypt.compare(password,user.rows[0].password_hash)
        console.log(valid)
        if(!valid) throw new Error("Invalid email or password")
        
        const token = jwt.sign(
        { userId: user.rows[0].id, role: user.rows[0].role},
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
        );
        res.json({
            token,
            user: {
                id: user.rows[0].id,
                email: user.rows[0].email,
                role: user.rows[0].role,
                name: user.rows[0].full_name,
            },
});
    
    
    }catch(err){
        console.log("REAL ERROR:", err)
       res.status(401).json({ message: err.message });
    }

})


app.get('/total_members',async (req,res)=>{
    const get =  await db.query(
    `SELECT u.email,
	    u.full_name,
	    u.id,
        COUNT(p.id) AS project_count
        FROM users AS u
        LEFT JOIN projects AS p ON p.assigned_manager = u.id
        WHERE u.role = 'manager'
        GROUP BY u.id, u.full_name, u.email;`
	   )
       console.log(get.rows[0])
       res.json(JSON.stringify(get.rows))
})
app.post('/projects',async (req,res)=>{
    const { name,
    description,
    location,
    assigned_manager,
    assigned_client,
    start_date,
    finish_date,
    budget,
    status} = req.body

    console.log(name)
    console.log(description)
    console.log(location)
    console.log( assigned_manager)
    res.json("success")
})

app.post('/addManager',async (req,res)=>{
    const {email, name} =  req.body
    const saltRounds = 10; // how much computational work the hash requires — 10 is a common default
    const hashedPassword = await bcrypt.hash('1', saltRounds);
    const user = await db.query("SELECT email, role FROM users WHERE email = $1 AND role =$2",[email,'manager'])
    console.log(user.rows)
    console.log(user)
    if(user.rows.length != 0){
        throw new Error("Email already exist")
    }

    try{
        await db.query("INSERT INTO users(email,password_hash,full_name,role) VALUES($1,$2,$3,$4)",[email,hashedPassword,name,'manager'])
        res.status(201).json({ message: "Manager added" });
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Failed to add manager" });
    }
   

})

app.listen(PORT,()=>{
    console.log('Listining to PORT:'+ PORT)
})