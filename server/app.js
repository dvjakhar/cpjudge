const express = require("express");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const router = require('../server/routes/api');
const path = require('path')

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use('/api', router);

app.use(session({
    secret: 'feh3dlhs9lkd0ks7dlsh2jlsdosi8',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

const uri = "mongodb+srv://dvjakhar:helloworld@cluster0.ubhau.mongodb.net/cpjudge?retryWrites=true&w=majority"
mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);

require('./config/passport')(passport);
require('./routes/auth')(app, passport);
require('./routes/index')(app, passport);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
