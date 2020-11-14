const TodoModel = require('../Models/todoModel')
const mongoose = require('mongoose')

module.exports = {

  addTodo: async (req, res) => {
    try {
      const newtodo = new TodoModel({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        todo: req.body.todo
      })
      const todo = await newtodo.save()
      if (todo) {
        res.status(200).json({
          message: 'added successfully'
        })
      }
    } catch (e) {
      res.status(500).json({
        error: e
      })
    }
  },
  getTodo: async (req, res) => {
    const alltodo = await TodoModel.find({})
    res.status(200).json({
      todos: alltodo
    })
  },

  removeTodo: async (req, res) => {
    try {
      const todoId = req.params.id

      const deletedtodo = await TodoModel.findOneAndRemove({ _id: todoId })
      if (deletedtodo) {
        res.status(200).json({
          message: 'remove a particular todo items' + todoId,
          error: null
        })
      }
    } catch (e) {
      res.status(500).json({
        message: 'remove a particular todo items',
        error: e
      })
    }
  }
}
