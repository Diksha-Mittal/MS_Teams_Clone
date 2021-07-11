const mongoose = require('mongoose');

var conn = require('../db/conn');

const msgschema = new mongoose.Schema({
    username: {
        type: String
    },
    text: {
        type: String
    },
    time: {
        type: String
    }
})

const chatschema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    msgs: [msgschema]
})

const Chat = conn.room_chats.model('Chat', chatschema);
module.exports = Chat;