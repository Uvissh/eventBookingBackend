const mockPayment = require("../utils/mockPayment");
const pool = require('../db');

const concertBooking =async(req,res,next)=>{
    const  {seat_id} = req.body;
    const user_id = req.userId;
  const client =  await pool.connect();
  try{
   await client.query("BEGIN");
   //find the seat which aviaable
   const  result = await client.query(`select * from  concertSeats where id = $1 and status ='AVAILABLE'
     for update skip locked`,[seat_id]);
   if(result.rows.length === 0){
    await client.query("ROLLBACK");
    return  res.status(409).json({
        error:"Seat is unavialble or currently being locked"
    });
   }
   console.log("seat successfully locked");
//do the payment
   await mockPayment();
   console.log("payment successfull");
   //update seat to booked
   await client.query(`update concertSeats 
    set status = 'BOOKED' where id = $1 returning*`,[seat_id]);
   console.log("seat update successfully");
   //update the  concertBookingResult
   

   const concertBookingResult = await client.query(`Insert into concertbooking(seat_id ,user_id,payment_status)VALUES($1,$2,'SUCCESS') returning*`,[seat_id,user_id]);
   await client.query("COMMIT");

   return res.status(201).json({
    message:"Seat Booked successfully",
    concertBooking:concertBookingResult.rows[0]
   })


    
  }catch(err){
    await client.query("ROLLBACK");
    console.log(err);
    next(err);
    

  }finally{
    client.release();
  }

}
module.exports = concertBooking;

