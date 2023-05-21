const express = require('express')
const route = express.Router()
const bodyParser = require('body-parser')
route.use(bodyParser.json()); 
route.use(bodyParser.urlencoded({ extended: true }));
const verify = require('./functions/varifytoke')
const User = require("../models/user");
const Post = require('../models/post')
const jwt = require('jsonwebtoken')

const multer = require('multer');

var storageFiles = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function(req, file, cb) {
      let ext = file.originalname.substring(
        file.originalname.lastIndexOf("."),
        file.originalname.length
      );
      cb(null, file.originalname + "-" + Date.now() + ext);
    }
  });
var uploadFiles = multer({ storage: storageFiles });

route.post('/',uploadFiles.single("profileImage"),verify,async(req,res)=>{
    
    jwt.verify(req.token , 'secretkey',(err,data)=>{
        if(err){
            console.log('403 jwt if err');
            res.sendStatus(403)
        }
        else{
            if(req.file === undefined){
                User.updateOne({_id:req.body.id},{
                    username:req.body.username,
                    phone:req.body.phone,
                    email:req.body.email,
                    bio:req.body.bio
                })
                .then(()=>res.status(200).json({message: 'success'}))
                .catch((err)=>res.status(403).json({message: 'somthing went wrong'}))
            }
            else{
                User.updateOne({_id:req.body.id},{
                    username:req.body.username,
                    phone:req.body.phone,
                    email:req.body.email,
                    profileImage :req.file.filename ,
                    bio:req.body.bio
                })
                .then(()=>res.status(200).json({message: 'success'}))
                .catch((err)=>res.status(403).json({message: 'somthing went wrong'}))
            }
           
               
        }
    })
})

route.post('/deletepost',verify,(req,res)=>{
    jwt.verify(req.token , 'secretkey',(err,data)=>{
        if(err){
            console.log('403 jwt if err');
            res.sendStatus(403)
        }
        else{
            Post.deleteOne({_id:req.body.id})
            .then(()=>{
                console.log('delete post')
                res.status(200).json({message: 'delete post'})
            })
            .catch((err)=>{
                console.log(err)
                res.status(403).json({message: 'somthing went wrong'})
            })
        }
    })
})

module.exports= route