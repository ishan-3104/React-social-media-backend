const mongoose = require("mongoose");

const StorySchema = mongoose.Schema(
  {
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    storylist:{type: String},
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", StorySchema);
module.exports = Story;