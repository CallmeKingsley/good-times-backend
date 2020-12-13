const mongoose = require('mongoose')

const feedbackSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  message: String,
  createdDate: { type: String, default: new Date().getTime() },
  creator: String
})

module.exports = mongoose.model('feedback', feedbackSchema)
