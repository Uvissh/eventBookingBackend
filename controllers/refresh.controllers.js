const jwt = require('jsonwebtoken');
const pool = require("../database/db");
const dotenv = require('dotenv');
const getDb = require("../utils/getDb")

dotenv.config();
const refreshController = async(req,res)=>{
    const refreshToken  = req.cookies.refreshToken;
  console.log(refreshToken);
  
    
    if(!refreshToken){
        return res.status(401).json({
            message:"Refresh token is required"
        
        })
    }

            const decoded  = jwt.verify(refreshToken,process.env.REFRESH_SECRET);
        if(decoded.type != 'refresh'){
            return res.status(401).json({
                message:"invalid refresh token"
            })
        }
        const user_id = decoded.userId;
          const db  =  getDb(user_id);
        
      
           const result = await db.query(
            `SELECT * FROM refresh_tokens
             WHERE token = $1`,
            [refreshToken]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }
        //verify the jwt token
        
//now the access token has expired we are signing the new acces token is signing in
        const newAccessToken =  jwt.sign( {
        userId: decoded.userId,
        type: "access"
    },process.env.JWT_SECRET,{expiresIn:"1h"});


        return res.status(201).json({
            message:"new Access token",
            token: newAccessToken
        })
        
    
}
module.exports = refreshController;