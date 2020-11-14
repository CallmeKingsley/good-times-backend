const mongoose = require('mongoose')

const mediaSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  kind: String,
  TrackName: String,
  releaseDate: String,
  artistName: String,
  image: String,
  previewUrl: String,
  collectionId: Number,
  trackId: Number,
  collectionName: String,
  ranking: Number,
  creator:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userSchema'
  }
})

module.exports = mongoose.model('media', mediaSchema)