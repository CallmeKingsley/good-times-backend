const mongoose = require('mongoose')

const mediaSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  kind: String,
  trackName: String,
  releaseDate: String,
  artistName: String,
  image: String,
  previewUrl: String,
  collectionId: Number,
  trackId: Number,
  collectionName: String,
  ranking: Number,
  isDeleted: { type: Boolean, default: false },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userSchema'
  }
})

module.exports = mongoose.model('media', mediaSchema)
