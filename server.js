const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const cookies = require('cookie-parser');
const bcrypt = require('bcrypt');
const fs = require('fs')
const db = {}
app.use(cookies());
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const strategy = new passport.strategies.SessionStrategy((username, password, done) => {
	const user = db.find(user => user.username === username)	
	if (!user) { return done(null, false); }
    if (!bcrypt.compareSync(passport, user.password)) { return done(null, false); }
    return done(null, user); }
)
passport.use(strategy)

app.listen(3000, console.log);

app.get('/home', passport.authenticate(strategy, {failureRedirect: '/login'}), (req, res) => {
	res.end(fs.readFileSync('./public/home.html', {encoding: 'utf-8'}));
});

app.get('/signup', (req, res) => {
	console.log(req.body)
	res.end(fs.readFileSync('./public/signup.html'));
})
app.post('/signup', (req, res) => {
	db.push({username: req.body.username, password: bcrypt.hashSync(req.body.password, 10)})
	res.redirect('/home')
})

app.get('/login', (req, res) => {
	res.end(fs.readFileSync('./public/login.html', {encoding: 'utf-8'}));
})
app.post('/login', passport.authenticate(strategy, {failureRedirect: '/login'}), (req, res) => 
	res.redirect('/home')
)

app.post('/logout', (req, res) => {
	res.end('ok');
})