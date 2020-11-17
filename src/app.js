const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
require('./db/mongoose');
const userRouter = require('./routes/user');
const messageRouter = require('./routes/message');
const app = express();
const dev = app.get('env') !== 'production';

const buildDirectory = path.join(__dirname, '../intranet-client/build');
const normalizePort = port => parseInt(port, 10);
const port = normalizePort(process.env.port || 3000);

if(!dev){
    app.disable('x-powered-by');
    app.use(compression());
    app.use(morgan('common'));

    app.use(express.static(buildDirectory));
    app.use(express.json());
    app.use(userRouter);
    app.use(messageRouter);
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../intranet-client/build', 'index.html'));
    });
}

if(dev){
    app.use(morgan('dev'));
    app.use(express.static(buildDirectory));
    app.use(express.json());
    app.use(userRouter);
    app.use(messageRouter);
}

app.get('/', function (req, res, next) {
    res.render('index');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

