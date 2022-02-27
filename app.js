const express = require('express')
const expressHandlebars = require('express-handlebars')

const handlers = require('./lib/handlers')

const app = express()


app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars');

const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'));

app.get('/', handlers.home);

app.get('/about', handlers.about);

// Пользовательская страница 404
app.use(handlers.notFound);

// Пользовательская страница 500
app.use(handlers.serverError);

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Express запущен на http://localhost:${port}; Нажмите Ctrl+C для завершения.`);
    })
} else {
    module.exports = app
}
