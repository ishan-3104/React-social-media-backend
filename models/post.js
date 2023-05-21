const mongoose = require("mongoose");
const Post = new mongoose.Schema(
  {
    username:{
        type:String
    },
    userId:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
    // profileImage:{
    //     type:String
    // },
    caption:{
        type:String
    },
    postimage:{
        type:String
    },
    postTime :{
        type:String
    },
    postLike:{
        type:[{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        
    },
    cmtArray : [{
        userId:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
        comment : String,
        commentTime: String,
    }]
  }
);
module.exports = mongoose.model("Post", Post);