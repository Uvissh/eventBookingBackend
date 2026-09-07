const pool = require("../db");

const getSeats  = async(req,res)=>{

    const result = await pool.query(`select * from seats order by id`)


    return res.status(200).json({
        seats:result.rows
    })
    
}
module.exports = getSeats