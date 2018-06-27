const express = require('express');
const app = express();
const PORT = process.env.port || 5001;

app.get('/', (req, res) => {
    res.send('hello world')
});
app.use(PORT, () => {
    console.log(`Hey there guise I'm on ports ${PORT}`)
});

