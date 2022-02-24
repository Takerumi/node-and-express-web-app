const express = require('express');
const app = express();
const handlebars = require('express-handlebars')
        .create({ defaultLayout: 'main' });
const fortune = require('./lib/fortune');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/about', function(req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js' 
    });
});

app.get('/products/tyrannofex', function(req, res) {
    res.render('products/tyrannofex');
});

app.get('/products/request-item-price', function(req, res) {
    res.render('products/request-item-price');
});

app.use(function(req, res, next) {
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log(`Express запущен на http://localhost:${app.get('port')}; Нажмите Ctrl+C для завершения.`);
});