const express = require('express')
const { engine } = require('express-handlebars')

const handlers = require('./lib/handlers')

const app = express()

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.engine('handlebars', engine({
    defaultLayout: 'main'
}))

app.set('view engine', 'handlebars');

const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'));

app.get('/', handlers.home);

app.get('/about', handlers.about);

app.get('/newsletter', handlers.newsletter)
app.get('/newsletter-signup', handlers.api.newsletterSignup)
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess)
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou)

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
