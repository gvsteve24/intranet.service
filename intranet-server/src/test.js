const express = require('express');
const mongoose = require('mongoose');
require('./db/mongoose');
const Message = require('./model/message');
const Conversation = require('./model/conversation');
const {userSchema, User} = require('./model/user');

const retrieve = async (name) => {
    const user = await User.findOne({ kr_name: name }).exec();
    return user;
}

const delay = (data, ms) => {
    return new Promise((resolve, reject) => {
        resolve(data);
    })
}

const createMessage = async (sender, receiver, title, content) => {
    try{
        await sender;
        await receiver;
        let prevConversation, newConversation, message, senderId, receiverId, conversationId;

        Promise.all([sender, receiver]).then( involved => {
            Conversation.findOne({'participants.kr_name': {$all: [involved[0].kr_name, involved[1].kr_name]}}, '_id participants', function(err, conversation){
                if(err) console.error(err);
                prevConversation = conversation;

                console.log(prevConversation);
                if(!prevConversation) {
                    console.log('no previous conversation found');
                    newConversation = new Conversation({participants: []});
                    newConversation.participants.push(
                        {
                            kr_name: involved[0].kr_name,
                            en_name: involved[0].en_name,
                            department: involved[0].department
                        },
                        {
                            kr_name: involved[1].kr_name,
                            en_name: involved[1].en_name,
                            department: involved[1].department
                        }
                    );
                    conversationId = newConversation._id;
                }else {
                    conversationId = prevConversation._id;
                }
                
                senderId = involved[0]._id;
                receiverId = involved[1]._id;
    
                newConversation && newConversation.save(function(err, newConversation){
                    if(err) return console.error(err);
                    console.log(newConversation);
                });

                message = new Message({sender: senderId, receiver: receiverId, title, content, conversation: conversationId});
                
                message.save(function(err, message){
                    if(err) throw new Error(err);
                    console.log(message);
                });
            });

    
        });
        
        
    } catch(error) {
        console.log(error);
    }
}

const populateMessages = async (id) => { 
    const conversation = await Conversation.findOne({'participants._id': id});
    await conversation.populate({
        path: 'messages'
    }).execPopulate();

    console.log(conversation.messages);
}

const readMessage = async (sender) => {
    let senderId;
    await sender;
    await sender.then((result, error) => {
        if(error){
            console.log(error);
        }

        senderId = result._id;
    })

    const message = await Message.findOne({sender: senderId});

    console.log(message);
}

const readAndPopulateConversation = async (name) => {
    try {
        const user = await User.findOne({kr_name: name});
        if(!user)  throw new Error(error);
        await user.populate({
            path: 'conversations'
        }).execPopulate();
        
        if(user.conversations) console.log(user.conversations);
        else console.log('failed')
    } catch (error) {
        console.log(error);
    }
    
}

const populateWithCond = async(sender) => {
    let post  = await BlogPost.create({ title: 'Mongoose 5.5.0',  authorId: 1});        // function create = return promise
    await Comment.create([
        { _id: 1, blogPostId: post._id, authorId: 2},
        { _id: 2, blogPostId: post._id, authorId: 1},
        { _id: 3, blogPostId: post._id, authorId: 1, deleted: true}
    ]);

    post = await BlogPost.findOne().populate({
        path: 'Comments',
        match: doc => ({ authorId: doc.authorId, deleted: { $ne: true }})
    });
    console.log(post.comments.length);
}

const deleteConversation = async(id) => {
    await Message.deleteMany({conversation: id});
}

// const user1 = retrieve('조성구');
// const user2 = retrieve('이정현');

// createMessage(user1, user2, '성구 점심어땠어?', '카레는 나한테 안맞는거 같아');
// createMessage(user1, user2, '찬 점심뭐드실래요?', '카레어때요?');
// createMessage(user1, user2, '안녕하세요', '사업부 조성구입니다.');
// readConversation(user1);
deleteConversation("5f21ed0148c5ed3e08e92fda");
// populateMessages('5f1c4fa3d52c4422c080aaae');
// readAndPopulateConversation('이정현');
