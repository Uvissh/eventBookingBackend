
const pool = require('../db')
const concertSeats = async(req,res,next)=>{
    try{

    const result = await pool.query(`select * from concertSeats order by id`);

    return res.status(201).json({ 
           seats:result.rows
    });
    }catch(err){
        next(err);
        
    }

}
module.exports = concertSeats;
 