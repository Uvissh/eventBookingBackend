 const errorMiddleware = (err,req,res,next)=>{

    console.log(err.stack);
    console.log(err.message);

    return res.status(err.status||500).json({
        message:err.stack
    })
    
 }
  
 module.exports = errorMiddleware;
 