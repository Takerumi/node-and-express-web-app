module.exports = {

    resetValidation(req, res, next) {
        const { cart } = req.session
        if(cart) {
            cart.warnings = []
            cart.errors = []
        }
        next()
    },

    checkOffers(req, res, next) {
        const { cart } = req.session
        if(!cart) return next()
        if(cart.items.some(item => item.product.requiresPublicOffer)) {
            cart.warnings.push('Для того чтобы оформить заказ, необходимо принять договор оферты')
        }
        next()
    },

    checkPiecesCounts(req, res, next) {
        const { cart } = req.session
        if(!cart) return next()
        if(cart.items.some(item => item.pieces > item.product.maxPieces )) {
            cart.errors.push('В наличии недостаточно товара для добавления в корзину')
        }
        next()
    }

}