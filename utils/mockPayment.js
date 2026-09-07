const mockPayment = async()=>{

    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
  const success =  Math.random()<0.85;
  if(success){
    resolve("payment successful")
  }
  else{
    reject("payment failed")
  }

    })

},3000);
}


 module.exports = mockPayment;