const mongoose = require('mongoose')
require('dotenv').config()

module.exports = {

  mongoDBConfig () {
    mongoose.connect(
    'mongodb://good-times:Kingsley321@ds137139.mlab.com:37139/good-times?authSource=good-times&w=1',
    { useNewUrlParser: true , useUnifiedTopology: true ,retryWrites: false }, (err) => {
          if (err) {
            console.log('something bad happened')
            console.log(err)
          } else {
            console.log('something good happened')
          }
        })
    mongoose.set('useFindAndModify', false);
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useUnifiedTopology', true);
  }
  
}

