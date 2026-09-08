const {Pool} = require('pg');

   const pool= new Pool({
   host: "localhost",
   user: "postgres",
   password:"Vishal@12345",
   database: "EventBooking",
    port: 3001
})




module.exports = pool;