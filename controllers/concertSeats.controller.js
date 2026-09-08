
const pool = require("../database/db");
const pool1 = require("../database/db1");
const getDb = require("../utils/getDb");


const concertSeats = async(req,res,next)=>{
    try{

 const user_id = req.userId;
 console.log("concertuseriD",user_id);
 
 const db = getDb(user_id);

    const result = await db.query(`select * from concertSeats order by id`);

    return res.status(201).json({ 
           seats:result.rows
    });
    }catch(err){
        next(err);
        
    }

}
module.exports = concertSeats;
 