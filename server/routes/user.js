const router = require('express').Router()
const ctrls = require('../controllers/user')

router.post('/register', ctrls.register)
router.post('/login', ctrls.login)

module.exports = router

// CRUD: Create, Read, Update, Delete => 4 methods: post, get, update, delete