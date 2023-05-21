const express = require('express')
const route = express.Router()
var mongoose = require('mongoose');
const bodyParser = require('body-parser')
route.use(bodyParser.json()); 
route.use(bodyParser.urlencoded({ extended: true }));
const Message = require('../models/message')
const Chat = require('../models/chatModel')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const verify = require('./functions/varifytoke')

route.post('/creatchat',async(req,res)=>{
    // console.log('chatuserid',req.body.chatuserid);
    var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
        { users: { $elemMatch: { $eq: req.body.userid } } },
        { users: { $elemMatch: { $eq: req.body.chatuserid } } },
    ],
    }).populate("users","-password")
    .populate("latestMessage")

    isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "username email",
    });
    
    if (isChat.length > 0){
        
        res.send(isChat[0]);
    }
    else {
        var chatData = {
          chatName: "sender",
          isGroupChat: false,
          users: [req.body.userid, req.body.chatuserid],
            }
            
            try {
                const createdChat = await Chat.create(chatData);
                const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                    "users",
                    "-password"
                    );
                    res.status(200).json(FullChat);
                } catch (error) {
                    res.status(400);
                    throw new Error(error.message);
                }            
    };
})

route.post('/fetchchat',async(req,res)=>{
    Chat.find({ users: { $elemMatch: { $eq: req.body.userid } } })
    .populate("users", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
    results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name pic email",
    });
    res.status(200).send(results);
    });
})

route.post('/sendmessage',async(req,res)=>{

    const { content, chatId ,userid} = req.body;
    var newMessage = {
        sender: userid,
        content: content,
        chat: chatId,
    };
    try {
        var message = await Message.create(newMessage);
    
        message = await message.populate("sender", "username profileImage")
        message = await message.populate("chat")
        message = await User.populate(message, {
          path: "chat.users",
          select: "username profileImage email",
        });
    
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    
        res.json(message);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    
})

route.post('/fetchmessage',async(req,res)=>{
    try {
      if(req.body.chatId !="")
      {
        const messages = await Message.find({ chat: req.body.chatId })
          .populate("sender", "username profileImage email")
          // .populate({
          //   path:"chat",
          //   populate:{
          //     path:"users",
          //     model:"User"
          //   }
          // })
          .populate("chat")
          
          .catch((err)=>console.log(err))
        res.json(messages);
      }
      } catch (error) {
        res.status(400); 
        throw new Error(error.message);
      }
})
module.exports= route