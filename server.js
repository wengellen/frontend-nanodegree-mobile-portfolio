var express = require('express');



var app = express();
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

require('./routes')(app);


app.listen( process.env.PORT || 3000, function(){
    console.log('Server listening to port 3000')
})

