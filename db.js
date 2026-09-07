const {Pool} = require('pg');

   const pool= new Pool({
   host: "localhost",
   user: "postgres",
   password:"Vishal@12345",
   database: "EventBooking",
    port: 3001
})

 const pool1 = new Pool({
     host: "localhost",
   user: "postgres",
   password:"Vishal@12345",
   database: "EventBooking1",
    port: 3001

})

  function getUserDB(userId){
    const lastchar = userId[userId.length-1];
    const value  = parseInt(lastchar,16);

    if(value%2 ===0){
       
        
        return  pool;
    }
    
    

    return pool1;
}

module.exports = pool;