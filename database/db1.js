const {Pool} = require('pg');

   const pool1= new Pool({
   host: "localhost",
   user: "postgres",
   password:"Vishal@12345",
   database: "EventBooking1",
    port: 3001
})




module.exports = pool1;