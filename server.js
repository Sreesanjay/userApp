const express = require('express');
const app = express();
const path = require('path');
const hbs = require('express-handlebars');
const session = require('express-session')
const nocache=require('nocache');
const db=require('./config/connection');
require('dotenv').config()
const PORT=process.env.PORT
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
db.connect();
app.use(session({
    secret: 'session key',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge:1000000}
  }))
  app.use(express.static(path.join(__dirname, 'public')));
// view engine setup 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({ 
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'layout',
    }));
app.use('/', require('./routes/common'));
app.use((req, res) => {
  res.status(404).render('body/404')
})
app.listen(PORT,()=>console.log("create server on port",PORT))