const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userName: String,
  kind: String,
  emailAddress: String,
  passWord: String,
  deleteAccount : { type: Boolean, default: false },
  isLogOut: { type: Boolean, default: false },
  lastSeen: { type: String, default: new Date().getTime() },
  moviesList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'media'
    }
  ],
  musicsList:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'media'
    }
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'follower'
    }
  ],
  BlockedUser: Object,
  imageUrl: String
})

module.exports = mongoose.model('userSchema', userSchema)