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
    const {email,password} = req.body
    const user = await db.query("SELECT * FROM users WHERE email = $1",[email])
    console.log(user)
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
app.listen(PORT,()=>{
    console.log('Listining to PORT:'+ PORT)
})