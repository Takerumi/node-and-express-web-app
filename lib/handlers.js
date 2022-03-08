const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
'[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
'(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$')

// интерфейс подписки на рассылку
class NewsletterSignup {
    constructor({ name, email }) {
        this.name = name
        this.email = email
    }
    async save() {
        // асинхронный метод выполняющий сохранение в БД
        // возвращает промис
    }
}

exports.home = (req, res) => res.render('home')

exports.about = (req, res) => res.render('about')

exports.notFound = (req, res) => res.render('404')

// Express требует 4 аргумента в обработчике ошибок,
// поэтому нужно отключить правило no-unused-vars в ESLint
/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => res.render('500')
/* eslint-disable no-unused-vars */

exports.newsletterSignup = (req, res) => {
    res.render('newsletter', { csrf: 'Здесь находится токен CSRF' });
}

exports.newsletterSignupProcess = (req, res) => {
    const name = req.body.name || '', email = req.body.email || ''
    // валидация ввода
    if(!VALID_EMAIL_REGEX.test(email)) {
        req.session.flash = {
            type: 'danger',
            intro: 'Ошибка валидации',
            message: 'Введен некорректный адрес электронной почты.'
        }
        return res.redirect(303, '/newsletter-signup')
    }
    new NewsletterSignup({ name, email }).save()
        .then(() => {
            req.session.flash = {
                type: 'success',
                intro: 'Спасибо!',
                message: 'Вы подписались на новостную рассылку.'
            }
            return res.redirect(303, '/newsletter-archive')
        })
        .catch(err => {
            req.session.flash = {
                type: 'danger',
                intro: 'Ошибка базы данных!',
                message: 'Произошла ошибка базы данных. Пожалуйста, попробуйте позже.'
            }
            return res.redirect(303, '/newsletter-archive')
        })
}

exports.newsletterSignupThankYou = (req, res) => {
    res.render('newsletter-signup-thank-you')
}

exports.newsletterArchive = (req, res) => res.render('newsletter-archive')

exports.api = {
    newsletterSignup: (req, res) => {
        console.log('Токен CSRF (из скрытого поля формы): ' + req.body._csrf)
        console.log('Имя (из видимого поля формы): ' + req.body.name)
        console.log('E-mail (из видимого поля формы): ' + req.body.email)
        res.send({ result: 'success' })
    }
}

exports.miniatyresCompendiumContestProcess = (req, res, fields, files) => {
    console.log('данные поля: ', fields)
    console.log('файлы: ', files)
    res.redirect(303, '/contest/miniatyres-compendium-thank-you')
}