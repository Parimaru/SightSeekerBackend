const messageSchema = require("../schemas/Message")

const addMessage =  async (req, res) => {
    const { chatId, senderId, text } = req.body
    const message = new messageSchema({
        chatId,
        senderId,
        text
    })
    try {
        const result = await message.save()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getMessages = async (req, res) => {
    const { chatId }= req.params

    try {
        const result = await messageSchema.find({ chatId })
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = { addMessage, getMessages }