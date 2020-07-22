const path = require('path');
const express = require('express');
require('./src/db/mongoose');
const userRouter = require('./src/routes/userRoutes');
const app = express();
const port = 3000 || process.env.port;

const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory));
app.use(express.json());
app.use(userRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

