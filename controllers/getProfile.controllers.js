const pool = require("../database/db");
const getDb = require("../utils/getDb")


const getProfile = async(req,res)=>{
    
    const user_id = req.userId;
      const db  =  getDb(user_id);
   

    const  result = await db.query(`select * from users where id = $1`,[user_id]);
  
    if(result.rows.length === 0){
        return res.status(404).json({
            message:"user not found"
        })
    }
    return res.status(200).json({
      message:"user profile",
      user:result.rows[0]
    })



}

module.exports = getProfile