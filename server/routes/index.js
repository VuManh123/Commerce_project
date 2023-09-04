const userRouter = require('./user')
const{notFound, errHandler} = require('../middlewares/errHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)

    // Use Handler Error
    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes