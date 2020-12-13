const mongoose = require('mongoose')
require('dotenv').config()
module.exports = {

  mongoDBConfig () {
    mongoose.connect(
      'mongodb+srv://kingsley01:12345@cluster0.cgobi.mongodb.net/good-times?retryWrites=true&w=majority',
      { useNewUrlParser: true, useUnifiedTopology: true, retryWrites: false }, (err) => {
        if (err) {
          console.log('something bad happened')
          console.log(err)
        } else {
          console.log('something good happened')
        }
      })
    mongoose.set('useFindAndModify', false)
    mongoose.set('useNewUrlParser', true)
    mongoose.set('useUnifiedTopology', true)
  }
}
