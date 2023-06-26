const chatModel = require('../schemas/Chat')

const createChat = async (req, res) => {
    const newChat = new chatModel({
        members: [req.body.senderId, req.body.receiverId]
    })
    try {
        const result = await newChat.save()
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const userChats = async (req, res) => {
    try {
        const chat = await chatModel.find({
            members: {$in: [req.params.userId]}
        })
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
}

const findChat = async (req, res) => {
    try {
        const chat = await chatModel.findOne({
            members: {$all: [req.params.firstId, req.params.secondId]}
        })
        res.status(200).json(chat)
        
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = { createChat, userChats, findChat }