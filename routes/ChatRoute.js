const express = require('express')
const { createChat, userChats, findChat, createNewChat, deleteChat } = require('../controllers/chatController')

const app = express.Router()

app.post("/chat", createNewChat)
app.post("/chat", createChat)
app.get("/chat/:userId", userChats)
app.get("/chat/find/:firstId/:secondId", findChat)
app.delete("/", deleteChat)

module.exports = app