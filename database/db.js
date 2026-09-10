const {Pool} = require('pg');
 const dotenv = require('dotenv')
 dotenv.config();

   const pool= new Pool({
    user:process.env.DB1_USER,
   host:process.env.DB1_HOST,
   database:process.env.DB1_DATABASE,
   password:process.env.DB1_PASSWORD,
   port:process.env.DB1_PORT,
})




module.exports = pool;