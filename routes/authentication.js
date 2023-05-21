const express = require('express')
const route = express.Router()
const  cors = require("cors");
route.use(cors());
var mongoose = require('mongoose');
const bodyParser = require('body-parser')
route.use(bodyParser.json()); 
route.use(bodyParser.urlencoded({ extended: true }));
const bcrypt = require("bcrypt");
const User = require("../models/user");
var jwt = require("jsonwebtoken");
// const verifyToken = require('./functions/varifytoke')


mongoose.connect('mongodb+srv://ishanPatel:Ishan3104@cluster0.ikxah.mongodb.net/socialMedia');


route.post('/signin',async(req,res)=>{
    const saltRounds = 10
    req.body.password = await bcrypt.hash(req.body.password,saltRounds)
    var user1 = await new User({
    username : req.body.username,
    email : req.body.email,
    password: req.body.password ,
    phone: req.body.phone,
    })
    user1.save()
    .then(()=>res.status(200).json({message: 'success'}))
    .catch((err)=>  res.status(400).json({message:err.message}))

})

route.post('/login',async(req,res)=>{
        const user =
          (await User.findOne({
            email: req.body.username,
          })) || (await User.findOne({ username: req.body.username }));
        // res.send(user);
        if (user) {
           
          const validPasswrod = await bcrypt.compare(
            req.body.password,
            user.password
          );
          if (validPasswrod) {
            var token = jwt.sign(
              { profileImage: user.profileImage, username: user.username ,id:user._id},
              'secretkey',
              {
                expiresIn: "28d", // 24 hours
              }
            );
            res.status(200).json({ message: "Successfully login!", token: token });
            console.log('login successful');
          } else {
            res
              .status(400)
              .json({ message: "Password you enter is doesn't match!" });
          }
         
        } else {
          res.status(401).json({ message: "User Not Found!" });
        }
      
})
module.exports= route