const express = require('express');
const router = express.Router();
const controller = require('../Controllers').userController;
const config = require('../Config');

const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const storage = new GridFsStorage({
    url: 'mongodb://good-times:Kingsley321@ds137139.mlab.com:37139/good-times.photos',
    file: (req, file) => {
        console.log("create new file name");
      // instead of an object a string is returned
      return 'file_' + Date.now();
    }
  });
  const upload = multer({ storage });
// const Storage = multer.diskStorage({
//     destination(req, file, callback) {
//         callback(null, './images');
//     },
//     filename(req, file, callback) {
//         callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
//     },
// });

router.post('/addUser', controller.addUser)
router.get('/getUsers', controller.getUsers)
router.post('/searchUsers', controller.searchUsers)
router.get('/getUser/:Id', controller.getUser)
router.post('/logout', controller.logOut)
router.post('/setMovie', controller.setMovie)
router.post('/setMovies', controller.setMovies)
router.post('/logIn', controller.loginUser)
router.post('/setMusic', controller.setMusic)
router.post('/setMusics', controller.setMusics)
router.post('/emptyMedia', controller.emptyMedia)
router.post('/delete', controller.deleteAccount)
router.post('/addFollower', controller.addFollowerRequest)
router.post('/acccepRequest', controller.accepterFollowerRequest)
router.post('/rejectRequest', controller.rejectFollowerRequest)
router.post('/getFollowerMedia', /*config.upload.single('') ,*/controller.getFollowerMedia)
router.post('/upload', /*upload.single('photo'), */controller.uploadPhoto)

module.exports = router