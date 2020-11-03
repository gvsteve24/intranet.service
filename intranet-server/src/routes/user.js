const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const uploadUserPhoto = require('../middleware/uploadUserPhoto');
const { User } = require('../model/user');
const sharp = require('sharp');
const cors = require('cors');

router.use(cors());
router.post('/users/register', async (req, res) => {
    const user = new User(req.body);
    
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch(error) {
        res.status(400).send(error);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredential(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (error) {
        res.status(400).send();
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send({user: req.user, token: req.token});
})

router.get('/users', auth, async (req, res) => {
    try {
        let users;
        if(req.query.kr_name){
            const kr_name = req.query.kr_name;  
            users = await User.find({kr_name});  
        }else if(req.query.phone){
            const phone = req.query.phone;
            users = await User.find({phone});
        }else if(req.query.department){
            const department = req.query.department;
            users = await User.find({department});
        }else if(req.query.favorites){
            users = [];
            let favIds = [];
            
            for(let [key, value] of req.user.favorites){
                if(key !== 'undefined' && value === 'true')
                    favIds.push(key);
            }
            await favIds.reduce(async (memo, id) => {
                await memo;
                const user = await User.findOne({_id: id})
                users.push(user);
            }, undefined);
        }else {
            users = await User.find({});
        }
        
        res.status(201).send(users);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/users/logout', auth, async (req, res) => {
    const user = req.user;
    const newToken = req.token;
    try {
        
        user.tokens = user.tokens.filter((token) => {
            return token.token !== newToken;
        })

        await req.user.save();
        res.send(req.user);

    } catch (error) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) =>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()        
    } catch (e) {
        res.status(500).send()
    }
});

// user patch only password

router.patch('/users/password', auth, async (req, res) => {
    try {
        req.user.password = req.body.password;
        
        const user = req.user;

        await user.save();
        res.status(200).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.patch('/users/info', auth, uploadUserPhoto, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user._id}); 
        let updates = Object.keys(req.body);
        if(req.file){
            updates.push('avatar');
            const buffer = await sharp(`avatar/${req.file.filename}`).resize({ width: 100, height: 100 }).png().toBuffer();
            req.body.avatar = buffer;
        }
        const allowedUpdates = ['department', 'address', 'phone', 'avatar'];
        const isValidOperation = updates.every((update) => {
            return allowedUpdates.includes(update);
        });
    
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid Update' });
        }

        updates.forEach((update) => user[update] = req.body[update]);

        await user.save();
        res.status(200).send(user);
    } catch (error) {
        console.log('error');
        res.status(400).send(error);
    }
});

// add favorite user by id
router.patch('/users/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try{
        const user = req.user;
        if(Array.from(user.favorites.keys()).includes(`${_id}`)){
            let value = user.favorites.get(_id);
            await user.set(`favorites.${_id}`, value === 'true' ? false : true); 
        }else {
            await user.set(`favorites.${_id}`, true);
        }
        await user.save();

        res.status(200).send(user);
    }catch(e){
        res.status(500).send();
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (error) {
        res.status(400).send();
    }
});


module.exports = router;
