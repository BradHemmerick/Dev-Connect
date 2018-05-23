const express = require('express');
const mongoose = require('mongoose');
//require routes
const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')



const app = express();

//db config
const db = require('./config/keys').mongoURI
//connect to db
mongoose
    .connect(db)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.log(`Failed to connected to DB to to err: ${err}`));

app.get('/', (req, res) => res.send('Hello World!'));

// Use routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts',  posts)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`port started on ${port}`))
