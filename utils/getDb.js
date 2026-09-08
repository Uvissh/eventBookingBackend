const pool = require("../database/db");
const pool1 = require("../database/db1");

function  getDb(userId){
     const lastChar  =userId[userId.length-1];
    const lastNumber  = parseInt(lastChar,16);  
    if(lastNumber%2 ==0){
        return pool;
    }
    else{
        return pool1;
    }


}

module.exports = getDb