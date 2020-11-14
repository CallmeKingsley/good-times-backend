const express = require('express')
const router = express.Router()

const userRoutes = require('./userRoutes')

router.use('/User', userRoutes)

module.exports = router
