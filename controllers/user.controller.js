const pool = require("../db");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv= require('dotenv');
dotenv.config();
const  userEvents = require('../events/userEvents')
const  {getPool} = require('../db')



const  register = async(req,res)=>{
    const{email,password_hash} = req.body;
    if(!email || !password_hash){
        return res.json({
            message: "email and password are required"
        })
    }
        const userId = uuidv4();
        console.log(userId);
        
    const saltRounds =10;
    const passwordHash =  await bcrypt.hash(password_hash,saltRounds);
    const  result = await pool.query(`INSERT INTO  users (email,password_hash) VALUES($1,$2)   Returning * `,[email,passwordHash]);

     userEvents.emit("userRegistered",result.rows[0]);
    return res.status(201).json({
        message:"user register successfully",
        user:result.rows[0]
    })
}

const Login = async(req,res)=>{
const{email,password_hash} = req.body;
if(!email || !password_hash){
        return res.json({
            message: "email and password are required"
        })
    }
const result = await pool.query(`select * from users where email = $1 `,[email]);
const user = result.rows[0];


if(!user){
 return res.status(401).json({message:"invalid credentials"})   
}
const ismatchuser = await bcrypt.compare(password_hash,user.password_hash);

if(!ismatchuser){
    return res.status(401).json({
        message:"invalid credentials"
    })
}
if(ismatchuser){
      const result = await pool.query(`select * from users where email = $1 `,[email]);
const user = result.rows[0];
   const payload  = {userId:user.id,
                     type:"access"
    
   };
   const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'});
   const{password_hash,...safeuser}=user;

   //refresh token
    const refreshToken = jwt.sign({userId:user.id,type:"refresh"},process.env.REFRESH_SECRET,{expiresIn:"7d"});
    //for getting the user
    //placing  the token inside the cookie
    res.cookie("refreshToken",refreshToken,{
       httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
    })
 //store the refresh token

    await pool.query(`INSERT INTO refresh_tokens
            (user_id, token, expires_at)
            VALUES ($1, $2, NOW() + INTERVAL '7 days') returning *`,[user.id,refreshToken]);

   
   

   
   return res.status(201).json({
    message:"login successfully",
    token:token,
    user:safeuser

   })
}
   
}

module.exports = {register,Login};