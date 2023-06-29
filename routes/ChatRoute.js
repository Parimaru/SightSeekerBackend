const express = require('express')
const { createChat, userChats, findChat, createNewChat } = require('../controllers/chatController')

const app = express.Router()

app.post("/", createNewChat)
app.post("/", createChat)
app.get("/:userId", userChats)
app.get("/find/:firstId/:secondId", findChat)

module.exports = app