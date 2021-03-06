const mongoose = require('mongoose')

const followerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  followerImageURL: String,
  userImageURL: String,
  userId: String,
  followerId: String,
  userName: String,
  followerName: String,
  followerStatus: String,
  userStatus: String,
  userLastSeen: { type: String, default: new Date().getTime() },
  followerLastSeen: { type: String, default: new Date().getTime() },
})

module.exports = mongoose.model('follower', followerSchema)
