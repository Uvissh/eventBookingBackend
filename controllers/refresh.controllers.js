const jwt = require('jsonwebtoken');
const pool = require('../db')
const dotenv = require('dotenv');
dotenv.config();
const refreshController = async(req,res)=>{
    const refreshToken  = req.cookies.refreshToken;
  console.log(refreshToken);
  
    
    if(!refreshToken){
        return res.status(401).json({
            message:"Refresh token is required"
        
        })
    }

           const result = await pool.query(
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
        const decoded  = jwt.verify(refreshToken,process.env.REFRESH_SECRET);
        if(decoded.type != 'refresh'){
            return res.status(401).json({
                message:"invalid refresh token"
            })
        }
        
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