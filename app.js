//IMPORT MODULES
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');

//CREATE APPLICATION
const app = express();

//CONFIGURE APPLICATION
let host = 'localhost';
let port = 3000;
app.set('view engine','ejs');

//MOUNT MIDDLEWARE
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(morgan('tiny'));
app.use(
    session({
        secret: "qwertyuiopasdfghjklzxcvbnm",
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());
app.use((req,res,next) => {
    //console.log(req.session);
    res.locals.user = req.session.user || null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

//SET UP ROUTERS
const primary = require('./routes/primary');

app.use('/',primary);

//ERROR HANDLINGS
app.use((req,res,next) => {
    let err = new Error("The server cannot locate " + req.url + ".");

    err.status = 404;

    next(err);
});

app.use((req,res,err)=>{
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal server error.");
    }
    res.status(err.status);

    res.render('error',{err});
});

//START SERVER
app.listen(port,host,()=> {
    console.log(`Server is running on http://${host}:${port}`);
});