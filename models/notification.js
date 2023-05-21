const mongoose = require("mongoose");

const Notification = mongoose.Schema(
    {
        sender:{type:mongoose.Schema.Types.ObjectId, ref: "User"},
        receiver: {type:mongoose.Schema.Types.ObjectId, ref: "User"},
        postid : {type:mongoose.Schema.Types.ObjectId, ref: "Post"},
        like: {type:Boolean , default:false},
        comment:{type:Boolean , default:false},
        commentText:{type:String},
        followRequest :{type:Boolean , default:false}
    },
    { timestamps: true }
  );
  

  module.exports =  mongoose.model("Notification", Notification);