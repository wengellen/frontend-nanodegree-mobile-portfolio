var express = require('express');

module.exports = function(app) {
    //app.use('/', express.static('./assets'));
    app.use('/nano', express.static( './dist/static'));

    app.get('/', function(req, res){
        res.render('index', {msg: "Under Construction"})
    });

    app.get('/about', function(req, res){
        res.render('about.html', {msg: "Under Construction"})
    });

    app.get('/contact', function(req, res){
        res.render('contact.html', {msg: "Under Construction"})
    });
}
