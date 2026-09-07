const express = require('express');
const userController = require('../controllers/user.controller');
const google = require('../controllers/google.controller');


const userRouter  = express.Router();



userRouter.post('/api/auth/register',userController.register);
userRouter.post('/api/auth/login',userController.Login);
userRouter.post('/api/auth/google',google);


 
module.exports = userRouter;  