const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Conversation = require('./conversation');
const Message = require('./message');

const userSchema = new mongoose.Schema({
    kr_name: {
        type: String,
        required: true,
    },
    en_name: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        index: {
            unique: true,
            partialFilterExpression: { email: { $exists: true }}
        },
        required: true,
        trim: true,
        toLowerCase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        enum: [ '사업부', '연구소' ],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isMobilePhone(value)){
                throw new Error('Phone number is not valid. Mobile phone number is required.');
            }
        }
    },
    avatar: {
        type: Buffer
    },
    favorites: {
        type: Map,
        of: String
    },
    favMessages: {
        type: Map,
        of: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.index({email:1}, {partialFilterExpression: { email : {$exists: true} }});

userSchema.virtual('conversations', {
    ref: 'Conversation',
    localField: 'kr_name',
    foreignField: 'participants.kr_name'
}, { toJSON: {virtuals: true}});

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token: token});

    await user.save();
    return token;
};

userSchema.statics.findByCredential = async (email, password) => {
    const user = await User.findOne({email});

    if(!user) {
        throw new Error('Unable to login');
    }

    const isValidPass = await bcrypt.compare(password, user.password)

    if(!isValidPass){
        throw new Error('Unable to login');
    }

    return user;
}

userSchema.pre('save', async function(next) {
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.pre('remove', async function(next){
    const user = this;
    await Conversation.deleteMany({'participants.kr_name': user.kr_name});
    await Message.deleteMany({$or:[{sender: user._id}, {receiver: user._id}]});
    next();
})

const User = mongoose.model('User', userSchema);
module.exports = {userSchema, User};