const express = require('express')
const route = express.Router()
var mongoose = require('mongoose');
const bodyParser = require('body-parser')
route.use(bodyParser.json()); 
route.use(bodyParser.urlencoded({ extended: true }));
const verify = require('./functions/varifytoke')
const Post = require("../models/post");
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


route.post('/',uploadFiles.single("postimage"),verify,async(req,res)=>{
    jwt.verify(req.token , 'secretkey',(err,data)=>{
        if(err){
            console.log('403 jwt if err');
            res.sendStatus(403)
        }
        else{
            
            var Post1 =  new Post({
                userId : req.body.userId,
               
                caption : req.body.caption,
                postimage: req.file.filename ,
                postTime: req.body.postTime,
                postLike: req.body.postLike,
                })
                Post1.save()
                .then(()=>{
                    console.log('new post add');
                    res.status(200).json({message: 'success'})})
                .catch((err)=>  {
                    console.log('fail');
                    res.status(400).json({message:err.message})})
        }
    })
})

module.exports= route