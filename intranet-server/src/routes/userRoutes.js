const express = require('express');
const userRouter = new express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const User = require('../model/user');
const sharp = require('sharp');

userRouter.post('/users/register', async (req, res) => {
    const user = new User(req.body);
    
    try {
        await user.save();
        res.status(201).send({user});
    } catch(error) {
        res.status(400).send(error);
    }
})

userRouter.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(201).send(users);
    } catch (error) {
        res.status(400).send(error);
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)) {
            return cb(new Error('Please upload an image'))
        }
    
        cb(undefined, true)
    }
});

// userRouter.post('/profile', upload.single('avatar'), async ( req, res ) => {
//     const buffer = await sharp(req.file.buffer).resize({ width: 48, height: 48 }).png().toBuffer();
//     req.user.avatar = buffer;
//     await req.user.save();
//     res.send();
// }, (error, req, res, next) => {
//     res.status(400).send({error: error.message});
// });

userRouter.patch('/users', upload.single('avatar'), async (req, res) => {
    const user = await User.findOne({_id: '5f17dbb8122504403065afa5'}); 
    const updates = Object.keys(req.body);
    const buffer = await sharp(req.file.buffer).resize({ width: 48, height: 48 }).png().toBuffer();
    req.body.avatar = buffer;
    const allowedUpdates = ['department', 'address', 'phone', 'avatar'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid Update' });
    }
    try {
        updates.forEach((update) => user[update] = req.body[update]);

        await user.save();
        res.status(200).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
})

module.exports = userRouter;


// userRouter.use(cors())
// userRouter.post('/users/register', async (req, res) => {
//     const user = new User(req.body)
    
//     try {
//         await user.save()
//         const token = await user.generateAuthToken() 
//         res.status(201).send({user, token})
//     } catch (e) {
//         res.status(400).send(e)
//     }

// })

// userRouter.post('/users/login', async (req, res) => {

//     try {
//         const user = await User.findByCredentials(req.body.email, req.body.password)
//         const token  = await user.generateAuthToken()
//         res.send({user, token})
//     } catch (e) {
//         res.status(400).send()
//     }
// })

// userRouter.get('/users/me', auth, async (req, res) => {
//     res.send(req.user)
// })

// userRouter.post('/users/logout', auth, async (req, res) => {
//     const user = req.user
//     const newToken = req.token
//     try {

//         user.tokens = user.tokens.filter((token) => {
//             return token.token !== newToken
//         })
        
//         await req.user.save()
//         res.send(req.user)
        
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// userRouter.post('/users/logoutAll', auth, async (req, res) =>{
//     try {
//         req.user.tokens = []
//         await req.user.save()
//         res.send()        
//     } catch (e) {
//         res.status(500).send()
//     }
// })


// userRouter.patch('/users/me', auth, async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['age', 'name', 'email', 'password']
//     const isValidOperation = updates.every((update) => {
//         return allowedUpdates.includes(update)
//     })

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid Update' })
//     }
//     try {
//         const user = req.user

//         updates.forEach((update) => user[update] = req.body[update])

//         await user.save()
//         res.status(200).send(user)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// userRouter.delete('/users/me', auth, async (req, res) => {
//     try {
//         await req.user.remove()
//         res.send(req.user)
//     } catch (e) {
//         res.status(400).send()
//     }
// })

