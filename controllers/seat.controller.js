const pool = require("../database/db");
const getDb = require("../utils/getDb");


const getSeats  = async(req,res)=>{

  const user_id = req.userId
  console.log("seat",user_id);
  
  const db =  getDb(user_id);
   

    const result = await db.query(`select * from seats order by id`)


    return res.status(200).json({
        seats:result.rows
    })
    
}
module.exports = getSeats