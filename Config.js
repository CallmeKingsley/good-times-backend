const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
const mongoUri = "mongodb://good-times:Kingsley321@ds137139.mlab.com:37139/good-times?authSource=good-times&w=1";

require('dotenv').config()

// Init gfs
// let gfs;
// let conn = mongoose.createConnection(mongoUri);
// conn.once('open', () => {
//   // Init stream
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('uploads');
// });

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
  },
  // Create storage engine
//  storage () {
//   new GridFsStorage({
//     url: mongoUri,
//     file: (req, file) => {
//       return new Promise((resolve, reject) => {
//         crypto.randomBytes(16, (err, buf) => {
//           if (err) {
//             return reject(err);
//           }
//           const filename = buf.toString('hex') + path.extname(file.originalname);
//           const fileInfo = {
//             filename: filename,
//             bucketName: 'uploads'
//           };
//           resolve(fileInfo);
//         });
//       });
//     }
//   })
//  },
//   upload () {
//     return multer({ storage })
//   }
}

