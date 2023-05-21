const express = require('express')
const route = express.Router()
var mongoose = require('mongoose');
const bodyParser = require('body-parser')
route.use(bodyParser.json()); 
route.use(bodyParser.urlencoded({ extended: true }));
const Post = require("../models/post");


const jwt = require('jsonwebtoken')
const verify = require('./functions/varifytoke')

route.post('/',verify,(req,res)=>{
    jwt.verify(req.token , 'secretkey',(err,data)=>{
        if(err){
            console.log('403 jwt if err');
            res.sendStatus(403)
        }
        else{
            console.log('in if');
            Post.updateOne({_id:req.body.postId},{"$push" :{
                cmtArray : {
                    userId: req.body.userId,
                    comment: req.body.comment,
                    commentTime: req.body.commentTime
                }
            }})
            .then((data)=>{res.send(data)})
            .catch((err)=>{console.log(err);})
        }
    })

})

route.post('/getallcomment',verify,(req,res)=>{
    Post.find({_id: req.body.postId}).populate({
        path:"cmtArray",
        populate:{
            path:"userId",
            model:"User",
        }
    
    })
    .then((data)=>{
        return res.status(200).json({message :'success',data:data})
    })
    .catch((err)=>{
        return res.status(403).json({message :'fail',err:err})
    })
})
module.exports= route