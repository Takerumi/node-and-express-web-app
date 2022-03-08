const express = require('express')
const { engine } = require('express-handlebars')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')

const requiresPublicOffer = require('./lib/publicOffer')
const cartValidation = require('./lib/cartValidation')

const app = express()

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

const secret = String(Math.random())
app.use(cookieParser(secret))
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret
}))

app.engine('handlebars', engine({
    defaultLayout: 'main'
}))

app.set('view engine', 'handlebars');

const products = [
    { id: 'hPc8YUbFuZM9edw4DaxwHk', name: 'Blood Angels Terminator Assault Squad', price: 60, requiresPublicOffer: true },
    { id: 'eyryDtCCu9UUcqe9XgjbRk', name: 'Scarab Occult Terminators', price: 60 },
    { id: '6oC1Akf6EbcxWZXHQYNFwx', name: 'Magnus the Red', price: 160 },
    { id: 'w6wTWMx39zcBiTdpM9w5J7', name: 'Knight Castellan', price: 170, requiresPublicOffer: true}
]

const productsByID = products.reduce((byId, p) => Object.assign(byId, { [p.id]: p }), {})

app.use(cartValidation.resetValidation)
app.use(cartValidation.checkOffers)
app.use(cartValidation.checkPiecesCounts)

// промежуточное ПО для очистки корзины
// без него предупреждения не будут исчезать при удалении товаров

app.use((req, res, next) => {
    const { cart } = req.session
    if(cart) cart.warnings = []
    next()
})

// промежуточное ПО для проверки корзины
app.use(requiresPublicOffer)

app.get('/', (req, res) => {
    const cart = req.session.cart || { items: [] }
    const context = { products, cart }
    res.render('home', context)
})

app.post('/add-to-cart', (req, res) => {
    if(!req.session.cart) req.session.cart = { items: [] }
    const { cart } = req.session
    Object.keys(req.body).forEach(key => {
        if(!key.startsWith('pieces-')) return
        const productId = key.split('-')[1]
        const product = productsByID[productId]
        const pieces = Number(req.body[key])
        if(pieces === 0) return
        if(!cart.items.some(item => item.product.id === productId)) cart.items.push({ product, pieces: 0 })
        const idx = cart.items.findIndex(item => item.product.id === productId)
        const item = cart.items[idx]
        item.pieces += pieces
        if(item.pieces < 0) item.pieces = 0
        if(item.pieces === 0) cart.items.splice(idx, 1)
    })
    res.redirect('/')
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Express запущен на http://localhost:${port}; Нажмите Ctrl+C для завершения.`))