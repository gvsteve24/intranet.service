const path = require('path');
const express = require('express');
require('./db/mongoose');
const userRouter = require('./routes/user');
const messageRouter = require('./routes/message');
const app = express();
const port = 3000 || process.env.port;

const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory));
app.use(express.json());
app.use(userRouter);
app.use(messageRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/../../intranet-client/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

