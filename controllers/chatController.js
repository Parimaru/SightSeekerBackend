const chatModel = require('../schemas/Chat')
const messageModel = require('../schemas/Message')

// const createChat = async (req, res) => {
//     const newChat = new chatModel({
//         members: [req.body.senderId, req.body.receiverId]
//     })
//     try {
//         const result = await newChat.save()
//         console.log("create chat", result)
//         res.status(201).json(result)
//     } catch (error) {
//         res.status(500).json(error)
//     }
// }

const createNewChat = async (req, res) => {
    const newChat = new chatModel({
        chatName: "My Chat",
        members: [req.body.senderId, req.body.receiverId]
    })
    try {
        const result = await newChat.save()
        console.log("create NEW chat", result)
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteChat = async (req, res) => {
    const { _id } = req.body
    try {
        const chatToDelete = await chatModel.deleteOne({ _id })
        const messagesToDelete = await messageModel.deleteMany( { chatId: _id } );
        if (!chatToDelete) return res.status(401).json({ error })
        res.status(200).json({ msg: `Chat successfully deleted` })
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}

const editChat = async (req, res) => {
    const { newChatName, _id } = req.body
    console.log("reqBody", req.body)
    try {
        const renameChat = await chatModel.findByIdAndUpdate(
            { _id },
            { chatName: newChatName },
            { new: true }
        )
        if (!renameChat) res.status(401).json({ msg: "No chats found to rename" })
        res.status(200).json(renameChat)
        console.log("this is renameChat",renameChat)
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}

const userChats = async (req, res) => {
    try {
      const userId = req.params.userId;
      const chats = await chatModel.find({
        $or: [
          { members: { $elemMatch: { $in: [userId] } } },
          { members: { $elemMatch: { $elemMatch: { $in: [userId] } } } },
        ],
      });
      res.status(200).json(chats);
    } catch (error) {
      res.status(500).json(error);
    }
};

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

module.exports = { /* createChat, */ userChats, findChat, createNewChat, deleteChat, editChat }