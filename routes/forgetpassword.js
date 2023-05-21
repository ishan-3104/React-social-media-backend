const express = require('express')
const route = express.Router()
var mongoose = require('mongoose');
const bodyParser = require('body-parser')
route.use(bodyParser.json()); 
route.use(bodyParser.urlencoded({ extended: true }));
const nodemailer = require('nodemailer');

require('dotenv').config();
const User = require("../models/user");

mongoose.connect('mongodb+srv://ishanPatel:Ishan3104@cluster0.ikxah.mongodb.net/socialMedia');

var otp     
function getRandomInt(min,max) {
    return Math.floor(
        Math.random() * (max - min) + min
      )
  }

route.post('/',async(req,res)=>{
    const user = (await User.findOne({email: req.body.email,})) ;
    if(user)
    {
        otp = getRandomInt(1000,10000)
        let transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
         });
        const mailOptions = {
            from: process.env.EMAIL_USERNAME, // Sender address
            to: req.body.email, // List of recipients
            subject: 'Reset Password varification mail', // Subject line
            text: `OTP for reset password = ${otp}`, // Plain text body
        };
        transport.sendMail(mailOptions, function(err, info) {
            if (err) {
            console.log(err)
            res.send(err)
            } else {
            console.log(info);
            res.status(200).json({ message: "Successfully email verify!" });
            }
        });  
    }
    else {
        res.status(401).json({ message: "User Not Found!" });
    }
})

route.post('/verifyotp',(req,res)=>{ 
    if(req.body.otp == otp){    
        res.status(200).json({ message: "Successfully otp verify!" });
    }
    else{
        res.status(401).json({ message: "fail otp verify!" });
    }
})

module.exports= route