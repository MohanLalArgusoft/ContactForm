var express = require('express');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var contacts = require('./routes/contacts');

var cors = require('cors');

var app = express();

require('dotenv').config();

app.use(cors({
    origin:process.env.URL,
    credentials:true
}));

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB,()=>{
    console.log("DataBase is connected !");
});

app.use(bodyParser.json());

app.use('/users', routes);
app.use('/contacts', contacts);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    console.log('+++++++++++++');
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({message: err.message,})
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({message: err.message,})
});


module.exports = app;
