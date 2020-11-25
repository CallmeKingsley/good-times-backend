const express = require('express')
const router = express.Router()
const controller = require('../Controllers').userController

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
router.post('/getFollowerMedia', controller.getFollowerMedia)

module.exports = router