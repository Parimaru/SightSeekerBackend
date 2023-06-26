const express = require("express")
const { addMessage, getMessages } = require("../controllers/messageController")

const app = express.Router()

app.post("/", addMessage)
app.get("/:chatId", getMessages)

module.exports = app