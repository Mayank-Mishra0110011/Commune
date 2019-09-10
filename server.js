const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
const app = express();
const db = require('./config/keys').mongoURI;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
	.connect(db)
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((err) => {
		console.log(err);
	});

app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/api/users', users);

app.use('/api/posts', posts);

app.use('/api/profile', profile);

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server Running on port ${port}`);
});
