const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema(
//   {
//     text: { type: String, required: true },
//     user: { type: mongoose.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// const chatSchema = new mongoose.Schema({
//   roomName: { type: String, required: true },
//   messages: [messageSchema],
//   users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
// });

// module.exports = mongoose.model("Chat", chatSchema);


const chatSchema = new mongoose.Schema({
  members: {
    type: Array,
  },
},{
  timestamps: true
})

module.exports = mongoose.model("Chat", chatSchema);
