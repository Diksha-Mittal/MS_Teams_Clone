const mongoose = require('mongoose');

var conn = require('../db/conn');

//message schema
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

//chat schema
const chatschema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    msgs: [msgschema],
}, {
    writeConcern: {
        j: true,
        wtimeout: 1000
    }
})

const Chat = conn.room_chats.model('Chat', chatschema);
module.exports = Chat;