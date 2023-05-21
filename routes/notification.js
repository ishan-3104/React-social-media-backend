const express = require('express')
const route = express.Router()

const bodyParser = require('body-parser')
route.use(bodyParser.json()); 
route.use(bodyParser.urlencoded({ extended: true }));
const Notification=require('../models/notification')
const User = require("../models/user");
const Story = require('../models/story')
const jwt = require('jsonwebtoken')
const verify = require('./functions/varifytoke')

route.post('/addtonotification',verify,(req,res)=>{
    jwt.verify(req.token , 'secretkey',(err,data)=>{
        if(err){
            console.log('403 jwt if err');
            res.sendStatus(403)
        }
        else{
            console.log('hello');
            // var {sender,receiver,postid,like,comment,commentText} = req.body
            var newNotification = new Notification(req.body)
            newNotification.save()
            .then((response)=>{
                console.log('notification send');
                res.status(200).json(response)})
            .catch((err)=>{res.status(403).json({message : err})})
        }
    })
})

route.post('/fatchnotification',verify,(req,res)=>{
    jwt.verify(req.token , 'secretkey',(err,data)=>{
        if(err){
            console.log('403 jwt if err');
            res.sendStatus(403)
        }
        else{
            Notification.find({receiver:req.body.userId})
            .populate('sender')
            .populate('postid')
            .then((response)=>{
                res.status(200).json(response)
            })
            .catch((err)=>{
                res.status(403).json({message:'somthing went wrong'})
            })
        }
    })
})

route.post('/clearnotification',(req,res)=>{
    Notification.deleteMany({receiver:req.body.receiver})
    .then((response)=>{
        console.log('clear notification')
        res.send(response)
    })
})

route.post('/deleterequest',(req,res)=>{
    Notification.deleteOne({_id:req.body.id})
    .then((response)=>{
        console.log('delete follow request')
        res.send(response)
    })
    .catch((err)=>{console.log(err);})
})


module.exports= route