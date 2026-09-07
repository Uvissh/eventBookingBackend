const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service:"Gmail",
    auth:{
        user:"uvissh42@gmail.com",
        pass:process.env.GOOGLE_PASSWORD
    }
});
const sendRegsiterationEmail = async(email)=>{
    await transport.sendMail({
        from:"uvissh42@gmail.com",
        to:email,
        subject:" Congratulation Register Successful  ",
        text:"You are successfully register on our eventBooking website "
    });
    console.log("register email send to :",email);
    
}

const sendBoookingMessage = async(email,booking,seat)=>{
    await transport.sendMail({
         from:"uvissh42@gmail.com",
        to:email,
        subject:" Your seat has successfuly booked ",
        text:`Your BookingId is :  ${booking} and  seat number is 💺: ${seat} `,
        
    });
    console.log("Booking email send to :",email);

}
const sendCancelingMessage = async(email,booking,seat)=>{
    await transport.sendMail({
         from:"uvissh42@gmail.com",
        to:email,
        subject:" Your seat has successfuly cancellled ",
        text:`Your BookingId is :  ${booking} and  seat number is 💺: ${seat} `,
        
    });
    console.log("Cancelling email send to :",email);

}


module.exports = {sendRegsiterationEmail,sendBoookingMessage,sendCancelingMessage};