const pool = require("../database/db");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv= require('dotenv');
dotenv.config();
const  userEvents = require('../events/userEvents')
const { randomUUID } = require('crypto');
const pool1 = require("../database/db1");


const  register = async(req,res)=>{
    const{email,password_hash} = req.body;
    if(!email || !password_hash){
        return res.json({
            message: "email and password are required"
        })
    }
    const id= randomUUID();
    console.log(id);
    const lastChar  = id[id.length-1];
    const lastNumber  = parseInt(lastChar,16);  
        
    const saltRounds =10;
    const passwordHash =  await bcrypt.hash(password_hash,saltRounds);
    let result;

    if(lastNumber%2==0){
             result = await pool.query(`INSERT INTO  users (id,email,password_hash) VALUES($1,$2,$3)   Returning * `,[id,email,passwordHash]);

    }
    else{
        result = await pool1.query(`INSERT INTO  users (id,email,password_hash) VALUES($1,$2,$3)   Returning * `,[id,email,passwordHash]);
    }


     userEvents.emit("userRegistered",result.rows[0]);
    return res.status(201).json({
        message:"user register successfully",
        user:result.rows[0]
    })
}

const Login = async (req, res) => {

    const { email, password_hash } = req.body;

    if (!email || !password_hash) {
        return res.status(400).json({
            message: "email and password are required"
        });
    }


    let result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );

    let user;
    let userPool;

    if (result.rows.length > 0) {

        user = result.rows[0];
        userPool = pool;

    } else {

     

        result = await pool1.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if (result.rows.length > 0) {
            user = result.rows[0];
            userPool = pool1;
        }
    }



    if (!user) {
        return res.status(401).json({
            message: "invalid credentials"
        });
    }

   
    const ismatchuser = await bcrypt.compare(
        password_hash,
        user.password_hash
    );

    if (!ismatchuser) {
        return res.status(401).json({
            message: "invalid credentials"
        });
    }


    const payload = {
        userId: user.id,
        type: "access"
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

 

    const {
        password_hash: password,
        ...safeuser
    } = user;



    const refreshToken = jwt.sign(
        {
            userId: user.id,
            type: "refresh"
        },
        process.env.REFRESH_SECRET,
        {
            expiresIn: "7d"
        }
    );


    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });



    await userPool.query(
        `INSERT INTO refresh_tokens
        (user_id, token, expires_at)
        VALUES ($1, $2, NOW() + INTERVAL '7 days')
        RETURNING *`,
        [user.id, refreshToken]
    );



    return res.status(200).json({
        message: "login successfully",
        token: token,
        user: safeuser
    });
};

module.exports = {register,Login};