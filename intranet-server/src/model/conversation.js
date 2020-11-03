const mongoose = require('mongoose');
// const { userSchema } = require('./user');
const conversationSchema = new mongoose.Schema({
    participants: [mongoose.Schema.Types.Mixed]
})

conversationSchema.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'conversation'
}, { toJSON: {virtuals: true}})

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;