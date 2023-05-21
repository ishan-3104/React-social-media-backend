const express = require('express')
const app = express()
const Auth = require('./routes/authentication')
const Frogetpassword = require('./routes/forgetpassword')
const Resetpassword = require('./routes/resetpassword')
const Getalluser = require('./routes/getalluser')
const AddPost = require('./routes/addnewPost')
const likepost = require('./routes/likepost')
const Follow = require('./routes/follow')
const Comment = require('./routes/commentRoute')
const Chat = require('./routes/chat')
const Updateprofile = require('./routes/updateProfile')
const AddStory = require('./routes/addStory')
const Notification=require('./routes/notification')
const  cors = require("cors");
app.use(cors());
const path = require('path')
app.use('/static', express.static(path.resolve('uploads')))


app.use ('/auth',Auth)
app.use('/forgetpass',Frogetpassword)
app.use('/resetpass',Resetpassword)
app.use('/getalluser',Getalluser)
app.use('/addpost',AddPost)
app.use('/likepost',likepost)
app.use('/follow',Follow)
app.use('/comment',Comment)
app.use('/chat',Chat)
app.use('/updateprofile',Updateprofile)
app.use('/story',AddStory)
app.use('/notification',Notification)


const server = app.listen(5000,()=>{
    console.log('server is runing');
})

const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:'http://localhost:3000',
    }
})
io.on('connection',(socket)=>{
    
    // console.log('connected to soket.io');
    // console.log(socket.id,"hello");
    socket.on("setup",(userdata)=>{
        socket.join(userdata._id)
        socket.emit("connected")
    })

    socket.on("join chat",(room)=>{
        socket.join(room)
        // console.log("joined room :" + room);
    })
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message",(newMesageRecieved)=>{
        // console.log(newMesageRecieved);
        var chat = newMesageRecieved.chat
        if(!chat.users) return console.log("chat.users not define");
        chat.users.forEach(user => {
            if(user._id == newMesageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved", newMesageRecieved)
        }); 
    })

    
    socket.on('new notification',(data)=>{
        console.log(data.receiver,'data');
        console.log('socket call');
        socket.to(data.receiver).emit("send notification",{msg:'hellooooo'})
    })

    // socket.emit("me", socket.id)

    // socket.on("disconnect", () => {
	// 	socket.broadcast.emit("callEnded")
	// })

    // socket.on("callUser", (data) => {
	// 	io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	// })

	// socket.on("answerCall", (data) => {
	// 	io.to(data.to).emit("callAccepted", data.signal)
	// })

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userdata._id);
      });
})