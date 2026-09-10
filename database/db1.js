const {Pool} = require('pg');
 const dotenv = require('dotenv')
 dotenv.config();

   const pool1= new Pool({
   user:process.env.DB2_USER,
   host:process.env.DB2_HOST,
   database:process.env.DB2_DATABASE,
   password:process.env.DB2_PASSWORD,
   port:process.env.DB2_PORT,
})




module.exports = pool1;