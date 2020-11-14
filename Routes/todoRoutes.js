const express = require('express')
const router = express.Router()
const controller = require('../Controllers').todoController

router.post('/todo', controller.addTodo)
router.get('/todo', controller.getTodo)
router.delete('/todo/:id', controller.removeTodo)

module.exports = router
