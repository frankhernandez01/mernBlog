const express = require('express');
const mongoose = require('mongoose');
const { posts, profile, user } = require('./routes/api');
const app = express();
const PORT = process.env.port || 5001;

//DB Config 
const db = require('./config/keys').mongoURI;

//Connect to MongoDB 
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//Base End Point
app.get('/', (req, res) => { res.send('hello world') });

//Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

//Listen on the port
app.use(PORT, () => {
    console.log(`Hey there guise I'm on ports ${PORT}`)
});

