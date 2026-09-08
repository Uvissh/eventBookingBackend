const pool = require("../database/db");
const mockPayment = require("../utils/mockPayment");
const userEvents = require('../events/userEvents');
const getDb = require("../utils/getDb");


const booking = async (req, res) => {
    const { seat_id } = req.body;
    const user_id = req.userId;
    const db  =  getDb(user_id);
  
    
   
    
    const client = await db.connect();



    try {
        await client.query("BEGIN");


        const seatResult = await client.query(`select * from seats where id = $1 and
     status = 'AVAILABLE' 
    for update skip locked `, [seat_id])

        if (seatResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(409).json({
                error: "Seat unavailable or currently being booked"
            });
        }
        console.log('seat successfully locked');
        //mock paymnet
        await mockPayment();
        console.log("payment succesful");
        //change seat status
        await client.query(`update seats 
    set  status='BOOKED' where id = $1 returning *`, [seat_id]);

        //creating the booking record
        const bookingResult = await client.query(`insert into bookings(user_id,seat_id,payment_status) Values
    ($1,$2,'SUCCESS') Returning *`, [user_id, seat_id]);
        //every thing succeed

        const getEmailUser  = await client.query(`select email from users where  id= $1`,[user_id]);
        if(getEmailUser.rows[0].length === 0){
            return res.status(404).json({
              message:'data not  found'   
            })
        }
        
        
        
        await client.query("COMMIT");
        
        

      userEvents.emit("Bookedsuccessfully", getEmailUser.rows[0],bookingResult.rows[0],seatResult.rows[0])

        return res.status(201).json({
            message: "Booking successful",
            booking: bookingResult.rows[0]
        })



    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({
            message: "Booking failed"
        })


    } finally {
        client.release();

    }




}

module.exports = booking;