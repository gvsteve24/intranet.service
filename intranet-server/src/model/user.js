const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    kr_name: {
        type: String,
        required: true
    },
    en_name: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true,
        validate(value){
            if(!isEmail(value)){
                throw new Error;
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    
})