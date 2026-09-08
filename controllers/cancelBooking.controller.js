const pool = require("../database/db");
const userEvents  = require('../events/userEvents')
const getDb = require("../utils/getDb")


const cancelBooking = async(req,res)=>{

     const db  =  getDb(user_id);
    const client = await db.connect();

    try{
         await client.query("BEGIN");
         const{booking_id} = req.params;
         const user_id = req.userId;
         console.log(booking_id)
         const seatResult  = await client.query(`select  seat_id from bookings where id=$1`,[booking_id]);
         if(seatResult.rows.length ===0){
         await  client.query("ROLLBACK")
         return res.status(409).json({
            message:"seats is unavailble"
         })
         }
         const seat_id = seatResult.rows[0].seat_id
         console.log(seat_id);
         
         console.log("Got the seat_id from  bookings");
         
  

          //update the boookng status

          const bookingResult = await client.query(`update bookings
            set  booking_status  = 'Canceled'where id= $1 returning *`,[booking_id]);

            if(bookingResult.rows[0].length ===0){

                await client.query('ROLLBACK');
                return res.status(409).json({
                    message:"booking result is unavaible"
                })
            }
            console.log("settled status to cancel")

            //update the seats status

            const seatStatus = await client.query(`update seats SET
                status = 'AVAILABLE' where id =$1 returning *`,[seat_id] )

                if(seatStatus.rows[0].length ===0){

                await client.query('ROLLBACK');
                return res.status(409).json({
                    message:"seatStatus result is unavaible"
                })
            }
        
                console.log("status has updated");
                //get email for sending the email to user to notitiy
                const getEmail = await client.query(`select email from users where id =$1`,[user_id]);

            
                  await client.query("COMMIT");

//emitter
                  userEvents.emit("CancelBooking",getEmail.rows[0],booking_id,seat_id)
                  return res.status(200).json({
                    message:"Cancel successfully"
                  })
                



    }catch(error){
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({
            message:"cancel failed"
        })
    }finally{
       client.release();  
    }


} 
module.exports = cancelBooking;