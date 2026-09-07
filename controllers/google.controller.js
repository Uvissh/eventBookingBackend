const {OAuth2Client} = require('google-auth-library');
const pool = require('../db')
const googleClient = new  OAuth2Client("514019982654-o1fk4gkbgepaikgsjdfg05sk9rauf1dh.apps.googleusercontent.com");
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const google = async(req,res)=>{
    try{
        const {credential} = req.body;
        const ticket = await googleClient.verifyIdToken({
            idToken:credential,
            audience:"514019982654-o1fk4gkbgepaikgsjdfg05sk9rauf1dh.apps.googleusercontent.com"

        })
        console.log("Google token valid");
        //it extract the data from the ticket
        const payload = ticket.getPayload();
        const googleId = payload.sub;
        const email = payload.email;
        const name  = payload.name;
        console.log(googleId,email,name); 
        
        const result = await pool.query(`select * from users where google_id = $1`,[googleId]);
        console.log("Google user",result.rows);
        //existing google user alredy exsits
        if(result.rows.length > 0){
            const user = result.rows[0];
            const token = jwt.sign(
                {
                    userId:user.id,
                     
                    
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:"1d"
                }
            );
            //send jwt to react
            return res.json({
                message:"google login successful",
                token:token,
                email:email
            })

        }
        //case2 : Google Id doesnot exist 
        //check mai
        //google id doesnot exist
            const emailResult = await pool.query(`select * from users where email = $1`,[email]);
            //if  email already exist
            if(emailResult.rows.length>0){
              
                return res.status(409).json({
                    message:"An account with this email already exists.please login with  your password first"
                })
               
                
            }
            //completeely new user
            const newUser = await pool.query(`INSERT INTO USERS(email,google_id)VALUES($1,$2) Returning *`,[email,googleId]);
            console.log(newUser.rows[0]);
            

           const user = newUser.rows[0];
           const token = jwt.sign(
            {
                userId:user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1h"
            }
           )
           return res.json({
            message:"Google registration successful",
              token:token
           })
            
           
            
        }
    
        
    catch(error){
        console.error(error.message.stack);
        res.status(500).json({
            message:"Google authentication failed"
        })
        
    }
}
 
module.exports = google;
