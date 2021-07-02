const jwt = require('jsonwebtoken')
const { User } = require('../model/user');

const auth = async (req, res, next) => {
    try {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Header', 'Content-Type');
        res.header('Access-Control-Allow-Header', 'Authorization');
        const token = req.header('Authorization').replace('Bearer ','');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token}).catch((error)=> {
            console.error(error)
        });
        console.log(user ? 'user found' : 'please authenticate')
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({error: 'please authenticate'});
    }
}

module.exports = auth;
