const express = require('express');
const app = express();
const PORT = PROCESS.env.port || 5000;

app.listen('/', (req, res) => {
    res.send('hello world')
});
app.use(PORT, () => {
    console.log(`Hey there guise I'm on ports ${PORT}`)
});

