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
const saltRounds = 10; // how much computational work the hash requires — 10 is a common default
app.post('/validation',async (req,res)=>{
    const {email,password,role} = req.body
    console.log(email)
    console.log(role)
    const user = await db.query("SELECT * FROM users WHERE email = $1 AND role = $2",[email,role])
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


app.get('/total_manager',async (req,res)=>{
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
       res.status(200).json(get.rows);
})

app.get('/total_worker',async (req,res)=>{
    const get =  await db.query(
    `SELECT u.email,
	    u.full_name,
	    u.id,
        COUNT(p.id) AS project_count
        FROM users AS u
        LEFT JOIN projects AS p ON p.assigned_manager = u.id
        WHERE u.role = 'worker'
        GROUP BY u.id, u.full_name, u.email;`
	   )
       res.status(200).json(get.rows);
})
app.get('/total_client',async (req,res)=>{
    const get =  await db.query(
    `SELECT  u.full_name AS full_name,
	    u.id AS id,
		p.name AS project_name,
		m.full_name AS manager_name,
		p.status
        FROM users AS u
        LEFT JOIN projects AS p ON p.assigned_client = u.id
		LEFT JOIN users AS m ON p.assigned_manager = m.id
        WHERE u.role = 'client'
        GROUP BY u.id, u.full_name,p.name,m.full_name,p.status;`
	   )
       res.status(200).json(get.rows);
})

app.get('/projects', async(req,res)=>{
    try{
        const data = await db.query(`
            SELECT 	p.id,
            p.name,
            p.description,
            p.location,
            p.start_date,
            p.finish_date,
            p.budget,
            p.status,
            u.full_name AS manager,
            us.full_name AS client
    FROM projects AS p
    LEFT JOIN users AS u ON u.id = p.assigned_manager
    LEFT JOIN users AS us ON us.id = p.assigned_client `)

    res.status(200).json(data.rows);
    }catch(err){
        console.log(err)
    }


})
app.post('/createProject',async (req,res)=>{
    const { name,
    description,
    location,
    assigned_manager,
    assigned_client,
    start_date,
    finish_date,
    budget,
    status} = req.body
    
    console.log(assigned_manager)
    try{
        await db.query(`
            INSERT INTO projects(name,description,location,assigned_manager,assigned_client,start_date,finish_date,budget,status)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
            `,[name,description,location,assigned_manager,assigned_client,start_date,finish_date,budget,status])
            res.status(201).json({message:"Project Added"})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Failed to Add Project"})
    }

})

app.post('/addManager',async (req,res)=>{
    const {email, name} =  req.body
    // const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash('1', saltRounds);
    const user = await db.query("SELECT email, role FROM users WHERE email = $1 AND role =$2",[email,'manager'])
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

app.post('/addWorker',async(req,res)=>{
    const {email, name} =  req.body
    // const saltRounds = 10; // how much computational work the hash requires — 10 is a common default
    const hashedPassword = await bcrypt.hash('1', saltRounds);
    const user = await db.query("SELECT email, role FROM users WHERE email = $1 AND role =$2",[email,'worker'])
    if(user.rows.length != 0){
        throw new Error("Email already exist")
    }

    try{
        await db.query("INSERT INTO users(email,password_hash,full_name,role) VALUES($1,$2,$3,$4)",[email,hashedPassword,name,'worker'])
        res.status(201).json({ message: "Worker added" });
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Failed to add worker" });
    }
})

app.post('/registerClient',async(req,res)=>{
    const {full_name,email,password} = req.body
    const hashedPassword = await bcrypt.hash(password,saltRounds)
    const user = await db.query("SELECT email, role FROM users WHERE email = $1 AND role =$2",[email,'client'])
    if(user.rows.length !=0){
        throw new Error("Email already exist")
    }
    try{
        await db.query("INSERT INTO users(email,password_hash,full_name,role) VALUES($1,$2,$3,$4)",[email,hashedPassword,full_name,'client'])
        res.status(201).json({ message: "Account Successfully created" });
    }catch(err){
        res.status(500).json({ message: "Failed to Create an account" });
    }
  
})
app.listen(PORT,()=>{
    console.log('Listining to PORT:'+ PORT)
})