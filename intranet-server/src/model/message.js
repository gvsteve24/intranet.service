const mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateSeoul = moment.tz(Date.now(), "Asia/Seoul");

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    recv_chk: {
        type: Boolean
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    createdAt: {
        type: Date,
        default: dateSeoul
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Conversation'
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;