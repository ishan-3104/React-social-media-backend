const express = require('express')
const route = express.Router()
var mongoose = require('mongoose');
const bodyParser = require('body-parser')
route.use(bodyParser.json()); 
route.use(bodyParser.urlencoded({ extended: true }));
const bcrypt = require("bcrypt");
const User = require("../models/user");

mongoose.connect('mongodb+srv://ishanPatel:Ishan3104@cluster0.ikxah.mongodb.net/socialMedia');

route.post('/',async(req,res)=>{
    const saltRounds = 10
    req.body.password = await bcrypt.hash(req.body.password,saltRounds)
    User.updateOne({email: req.body.email},{password:req.body.password})
    .then((response)=>{
        console.log("updated-1")
        return res.status(200).json({message:response})
    }).catch((error)=>
    {   
        console.log("updated faile")
        return res.status(401).json({message:error.message})
    })
})



module.exports= route