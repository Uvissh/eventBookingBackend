const express = require('express');
const userRouter = require('./Routes/user.Routes');
const authMiddleware = require('./middleware/auth.middleware');
const seatrouter = require('./Routes/seat.Routes');
const bookingRouter = require('./Routes/booking.Routes');
const cors = require('cors');
const profileRouter = require('./Routes/getProfile.Routes');
const cancelRouter = require('./Routes/cancle.Routes');
const userEvents = require('./events/userEvents');
const {sendRegsiterationEmail} = require('./services/emailServices');
const {sendBoookingMessage} = require('./services/emailServices');
const{sendCancelingMessage} = require('./services/emailServices');
const refreshRouter = require('./Routes/refresh.Routes');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middleware/error.middleware');
const concertRouter = require('./Routes/concertSeats.Routes');
const concertBookingRouter = require('./Routes/concertBooking.Routes');
const cancelConcertRouter = require('./Routes/cancelConcertBooking.Routes');
const dotenv = require('dotenv');
dotenv.config();

const app =  express();
const port =  process.env.LOCALHOST||3000


app.use(cors({
    origin: "https://eventbookingfrontend1.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());
app.use(express.json());
app.use(cookieParser());

app.use(userRouter);
app.use(seatrouter);
app.use(refreshRouter)
app.use(concertRouter)
app.use(authMiddleware);
app.use(bookingRouter);
app.use(profileRouter)
app.use(cancelRouter)
app.use(concertBookingRouter);
app.use(cancelConcertRouter);
app.use(errorMiddleware)

userEvents.on("userRegistered",async(user)=>{
    try{
        await sendRegsiterationEmail(user.email);
    }catch(error){
        console.log("email sending failed",error.message);
        
    }
})
userEvents.on("Bookedsuccessfully",async(user,booking,seat)=>{
    try{
        await sendBoookingMessage(user.email,booking.id,seat.id);
    }catch(err){
        console.log("email sending failed",error.message);
        
    }
})
userEvents.on("CancelBooking",async(user,booking,seat)=>{
    try{
        await sendCancelingMessage(user.email,booking,seat);
    }catch(err){
        console.log("email sending failed",error.message);
        
    }
})

app.listen(port ,()=>{
    console.log(`Running in the port ${port}`);
})