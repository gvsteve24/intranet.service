const express = require('express');
const routes = new express.Router();
const Message = require('../model/message');
const auth = require('../middleware/auth');
const { User } = require('../model/user');
const Conversation = require('../model/conversation');

routes.post('/messages', auth, async (req, res) => {
    try {
        let prevConversation, newConversation, message, conversationId;

        const sender = req.user;
        const receiver = await User.findOne({ kr_name: req.body.to });                  // further development
        if(!receiver){
            return res.status(400).send({ error: "no recipient found" });
        };
        
        prevConversation = await Conversation.findOne({participants: 
            {$all: [
                {"$elemMatch" : {_id: sender._id, kr_name: sender.kr_name}}, 
                {"$elemMatch": {_id: receiver._id, kr_name: receiver.kr_name }}
            ]}
        });

        if(!prevConversation) {
            newConversation = new Conversation({participants: []});
            newConversation.participants.push({
                _id: sender._id,
                kr_name: sender.kr_name,
                en_name: sender.en_name,
                department: sender.department,
                phone: sender.phone
            },
            {
                _id: receiver._id,
                kr_name: receiver.kr_name,
                en_name: receiver.en_name,
                department: receiver.department,
                phone: receiver.phone
            });
            conversationId = newConversation._id;   
        } else {
            conversationId = prevConversation._id;
        }

        await newConversation && newConversation.save();

        message = new Message({sender: sender._id, receiver: receiver._id, title: req.body.title, content: req.body.content, conversation: conversationId});

        await message.save();

        res.status(200).send({message});
    } catch (error) {
        res.status(400).send();
    }
})

// messages?name=이정현
// messages?phone=010-6632-4431
// messages?title=톰
routes.get('/messages', auth, async ( req, res ) => {
    try {
        let messages = [], user;
        let sort = {};
        let match;

        if(req.query.name){
            user = await User.findOne({ kr_name: req.query.name });
            match = doc => ({'participants.kr_name': req.query.name});
        }

        if(req.query.phone){
            user = await User.findOne({ phone: req.query.phone });
            match = doc => ({'participants.phone' : req.query.phone});
        }
        
        await req.user.populate({
            path: 'conversations',
            match
        }).execPopulate();
    
        if(!req.user.conversations){
            res.send({ messages: 'no messages'});
        }
        
        if(req.query.title){
            match = { title: req.query.title };
        }
        
        if(req.query.sort && req.query.sort === 'sent'){
            match = { sender: req.user._id };
        }else if( req.query.sort && req.query.sort === 'received'){
            match = { receiver: req.user._id };
        }

        await req.user.conversations.reduce( async (memo, conversation) => {
            await memo;
            await conversation.populate({
                path: 'messages',
                match
            }).execPopulate();
            messages = messages.concat(...conversation.messages);
        }, undefined);

        messages = await Promise.all(messages.map(async message => {
            const sender = await User.findOne({_id: message.sender});
            const receiver = await User.findOne({_id: message.receiver});

            messageCopy = Object.assign({}, message._doc);
            messageCopy.sender_avatar = sender.avatar;
            messageCopy.sender_kr_name = sender.kr_name;
            messageCopy.receiver_kr_name = receiver.kr_name;
            messageCopy.sender_en_name = sender.en_name;
            messageCopy.receiver_en_name = receiver.en_name;

            return messageCopy;
        }));

        messages.sort((a, b) => {
            if(a.recv_chk && !b.recv_chk)
                return 1;
            else if(!a.recv_chk && b.recv_chk)
                return -1;
            else
                return 0;
        });
        
        res.status(200).send(messages);
    } catch (error) {
        res.status(400).send(error);
    }
});

// add messagePref when message is read first
routes.patch('/messages/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try{
        const doc = await Message.findByIdAndUpdate({_id}, {recv_chk: true});
        if(doc && doc.recv_chk){
            await doc.save();

            res.status(200).send(doc);
        }else{
            return res.status(500).send("no message found");
        }
    }catch(e){
        res.status(500).send();
    }
});

module.exports = routes;