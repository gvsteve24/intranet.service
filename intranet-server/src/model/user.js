const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        unique: true, 
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
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;