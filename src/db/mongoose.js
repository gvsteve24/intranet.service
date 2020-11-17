const mongoose = require('mongoose');
const db = mongoose.connection;
const url = process.env.MONGODB_URL;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=> {
    console.log('connected');
});