const express = require('express')
const route = express.Router()

const bodyParser = require('body-parser')
route.use(bodyParser.json()); 
route.use(bodyParser.urlencoded({ extended: true }));

const User = require("../models/user");
const Story = require('../models/story')
const jwt = require('jsonwebtoken')
const verify = require('./functions/varifytoke')

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


route.post('/',uploadFiles.single("storyimage"),verify,(req,res)=>{
    jwt.verify(req.token , 'secretkey',(err,data)=>{
        if(err){
            console.log('403 jwt if err');
            res.sendStatus(403)
        }
        else{
            var newStory = new Story({
                userid : req.body.userid,
                storylist :req.file.filename,
                
            })
            newStory.save()
            .then(()=>{
                Story.find({userid:req.body.userid},'_id')
                .then((response)=>{
                    User.updateOne({_id:req.body.userid},{story:response}).then((response)=>res.send(response))
                })
            })
            .catch((err)=>console.log(err))
        }
    })
    
})

route.post('/getstory',(req,res)=>{
    User.find({_id:req.body.id})
    .populate("story")
    .then((response)=>{
        res.send(response)
    })
    .catch((err)=>{
        console.log(err);
    })
})

route.get('/fatchallstory',(req,res)=>[
    Story.find().populate("userid")
    .then((response)=>{res.send(response)})
    .catch((err)=>res.status(403).json({message:'something wend wrong'}))
])

module.exports= route