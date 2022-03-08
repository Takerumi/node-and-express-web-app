module.exports = (req, res, next) => {
    const { cart } = req.session
    if(!cart) return next()
    if(cart.items.some(item => item.product.requiresPublicOffer)) {
        cart.warnings.push('Для того чтобы оформить заказ, необходимо принять договор оферты')
    }
    next()
}