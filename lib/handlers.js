const fortune = require('./fortune')

exports.home = (req, res) => res.render('home')

exports.about = (req, res) => res.render('about', {fortune: fortune.getFortune()})

exports.notFound = (req, res) => res.render('404')

// Express требует 4 аргумента в обработчике ошибок,
// поэтому нужно отключить правило no-unused-vars в ESLint
/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => res.render('500')
/* eslint-disable no-unused-vars */
