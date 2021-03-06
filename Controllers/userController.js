const UserModel = require('../Models/userModel')
const MediaModel = require('../Models/mediaModel')
const Follower = require('../Models/follower')
const Feedback = require('../Models/feedback')
const nodemailer = require('nodemailer')
const mongoose = require('mongoose')

module.exports = {
  loginUser: async (req, res) => {
    try {
      const emailAddress = req.body.userName.trim().toLowerCase()
      const passWord = req.body.password.trim()
      const user = await UserModel.findOne({ emailAddress, passWord, deleteAccount: false }).populate({ path: 'moviesList', model: 'media' }).populate({ path: 'musicsList', model: 'media' }).populate({ path: 'followers', model: 'follower' })
      
      if (user) {
        await UserModel.findOneAndUpdate({ _id: user._id }, { $set: { isLogOut: false, lastSeen: new Date().getTime() } })
        res.status(200).json({
          user: user
        })
      } else {
        res.status(504).json({
          user: []
        })
      }
    } catch (err) {
      res.status(204).json({
        error: err,
        message: 'error'
      })
    }
  },
  addUser: async (req, res) => {
    try {
      const newUser = new UserModel({
        _id: new mongoose.Types.ObjectId(),
        emailAddress: req.body.email,
        userName: req.body.userName.trim().toLowerCase(),
        passWord: req.body.password,
        lastSeen: new Date().getTime()
      })
      const user = await newUser.save()
      if (user) {
        res.status(200).json({
          message: 'added successfully',
          user
        })
      }
    } catch (e) {
      res.status(500).json({
        error: e
      })
    }
  },
  getUsers: async (req, res) => {
    const allUser = await UserModel.find({ deleteAccount: false }).populate({ path: 'moviesList', model: 'media' }).populate({ path: 'musicsList', model: 'media' }).populate({ path: 'followers', model: 'follower' })
    res.status(200).json({
      allUser
    })
  },
  getUserByEmail: async (req, res) => {
    const email = req.body.email
    const allUser = await UserModel.findOne({ deleteAccount: false, emailAddress: email }).populate({ path: 'moviesList', model: 'media' }).populate({ path: 'musicsList', model: 'media' }).populate({ path: 'followers', model: 'follower' })
    res.status(200).json({
      allUser
    })
  },
  getUser: async (req, res) => {
    const Id = req.params.Id.trim().toLowerCase()
    try {
      await UserModel.findOneAndUpdate({ _id: Id }, { $set: { lastSeen: new Date().getTime() } })
      const User = await UserModel.find({ _id: Id }).populate({ path: 'moviesList', model: 'media' }).populate({ path: 'musicsList', model: 'media' }).populate({ path: 'followers', model: 'follower' })
      await Follower.updateMany({followerId: Id}, {"$set":{followerLastSeen: new Date().getTime(),followerImageURL: User[0].imageUrl,followerName: User[0].userName }})
      await Follower.updateMany({userId: Id}, {"$set":{userLastSeen: new Date().getTime(),userImageURL: User[0].imageUrl, userName:User[0].userName }})
      res.status(200).json({
        User
      })
    } catch (e) {
      console.log(e)
    }
  },
  forgetPassword: async (req, res) =>{

    try {
  
      const Email = req.body.email
      const user = await UserModel.findOne({ emailAddress: Email })
      if (user) {
        const transporter = nodemailer.createTransport({
          host: 'smtp.mailtrap.io',
          port: 2525,
          secure: false, // true for 465, false for other ports
          auth: {
            user: "f40a3caa486af3",
            pass: "4f348daeaf6e49"
          }
        })
        var str = new String(process.env.FrontEnd_URL + '/forgotPw/' + user._id)
        var URL = process.env.FrontEnd_URL + '/forgotPw/' + user._id
        var Link = str.link(URL)

        const info = await transporter.sendMail({
          from: process.env.Company_Email, // sender address
          to: Email, // list of receivers
          subject: 'futureCompany reset password request ✔', // Subject line
          html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.<br>' +
          'Please click on the following link, or paste this into your browser to complete the process:<br>' + Link +
          '<br><br>If you did not request this, please ignore this email and your password will remain unchanged.<br>'
        }, errors => {
          console.log(errors)
          if (errors) {
      
            res.status(500).json({
              message: errors
            })
          }else{
            res.status(200).json({
              message: 'sent'
            })
          }
        })
      }
    } catch (e) {
      res.status(500).json({
        user: e,
        message: 'could\'t add user'
      })
    }  
  },
  addFollowerRequest: async (req, res) => {
    try {
      const followerId = req.body.followerId
      const currentUserId = req.body.id

      const User = await UserModel.find({ _id: currentUserId })
      const followerUser = await UserModel.find({ _id: followerId })

      const follower = new Follower({
        _id: new mongoose.Types.ObjectId(),
        followerImageURL: followerUser[0].imageUrl,
        userImageURL: User[0].imageUrl,
        userId: User[0]._id,
        followerId: followerUser[0]._id,
        userName: User[0].userName,
        followerName: followerUser[0].userName,
        followerStatus: 'pending',
        userStatus: 'request'
      })

      User[0].followers.push(follower)
      followerUser[0].followers.push(follower)

      await User[0].save()
      await followerUser[0].save()
      await follower.save()

      res.status(200).json({
        User
      })
    } catch (e) {
      console.log(e)
    }
  },

  accepterFollowerRequest: async (req, res) => {
    const followerId = req.body.followerId
    try {
      await Follower.findOneAndUpdate({ _id: followerId }, { $set: { followerStatus: 'accepted', userStatus: 'accepted' } }, (err, data) => {
        if (!err) {
          res.status(200).json({
            data
          })
        } else {
          res.status(200).json({
            data
          })
        }
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: e
      })
    }
  },
  rejectFollowerRequest: async (req, res) => {
    const followerId = req.body.followerId
    try {
      await Follower.findOneAndUpdate({ _id: followerId }, { $set: { followerStatus: 'reject', userStatus: 'reject' } }, (err, data) => {
        if (!err) {
          res.status(200).json({
            data
          })
        } else {
          res.status(200).json({
            data
          })
        }
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: e
      })
    }
  },
  searchUsers: async (req, res) => {
    const name = req.body.searchName
    try {
      const User = await UserModel.find({ userName: { $regex: name, $options: 'i' } }).populate({ path: 'moviesList', model: 'media' }).populate({ path: 'musicsList', model: 'media' }).populate({ path: 'followers', model: 'follower' })
      res.status(200).json({
        User
      })
    } catch (e) {
      console.log(e)
    }
  },
  getFollowerMedia: async (req, res) => {
    try {
      const Id = req.body.Id.trim().toLowerCase()
      const users = await UserModel.find({ _id: Id }).populate({ path: 'moviesList', model: 'media' }).populate({ path: 'musicsList', model: 'media' })
      res.status(200).json({
        allMovies: users[0].moviesList,
        allMusics: users[0].musicsList,
        userName: users[0].userName,
        userBio: users[0].bio,
        userImage: users[0].imageUrl
      })
    } catch (e) {
      res.status(500).json({
        error: e
      })
    }
  },
  logOut: async (req, res) => {
    try {
      const id = req.body.Id
      await UserModel.findOneAndUpdate({ _id: id }, { $set: { isLogOut: true, lastSeen: new Date().getTime() } }, (err, data) => {
        if (err) {
          console.log(err)
        } else {
          res.status(200).json({
            user: []
          })
        }
      })
      await Follower.updateMany({followerId: id}, {"$set":{followerLastSeen: new Date().getTime() }})
      await Follower.updateMany({userId: id}, {"$set":{userLastSeen: new Date().getTime() }})
    } catch (e) {
      res.status(500).json({
        error: e
      })
    }
  },
  deleteAccount: async (req, res) => {
    try {
      const emailAddress = req.body.email.trim().toLowerCase()
      await UserModel.findOneAndUpdate({ email: emailAddress }, { $set: { deleteAccount: true, lastSeen: new Date().getTime() } })
      res.status(200).json({
        user: user
      })
    } catch (e) {
      res.status(500).json({
        error: e
      })
    }
  },
  setMusic: async (req, res) => {
    try {
      const Id = req.body.Id.trim().toLowerCase()
      const data = req.body.appData.Data

      const userInfo = await UserModel.findById(Id)

      const musicData = new MediaModel({
        _id: new mongoose.Types.ObjectId(),
        kind: data.kind,
        trackName: data.trackName,
        releaseDate: data.releaseDate,
        artistName: data.artistName,
        image: data.image,
        previewUrl: data.previewUrl,
        collectionId: data.collectionId,
        trackId: data.trackId,
        collectionName: data.collectionName,
        ranking: data.ranking
      })

      userInfo.musicsList.push(musicData)
      await userInfo.save()

      musicData.creator = userInfo
      await musicData.save()

      res.status(200).json({
        musicData
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: e
      })
    }
  },

  setMovie: async (req, res) => {
    try {
      const Id = req.body.Id.trim().toLowerCase()
      const data = req.body.appData.Data

      const userInfo = await UserModel.findById(Id)

      const movieData = new MediaModel({
        _id: new mongoose.Types.ObjectId(),
        kind: data.kind,
        trackName: data.trackName,
        releaseDate: data.releaseDate,
        artistName: data.artistName,
        image: data.image,
        previewUrl: data.previewUrl,
        collectionId: data.collectionId,
        trackId: data.trackId,
        collectionName: data.collectionName,
        ranking: data.ranking
      })

      userInfo.moviesList.push(movieData)
      await userInfo.save()

      movieData.creator = userInfo
      await movieData.save()

      res.status(200).json({
        movieData
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: e
      })
    }
  },

  setMusics: async (req, res) => {
    try {
      const Id = req.body.Id.trim().toLowerCase()
      const Data = req.body.data
      const userInfo = await UserModel.findById(Id)
      var dataLength = Data.length

      // save the updated media to user table
      for (var i = 0; i < dataLength; i++) {
        const data = Data[i]
        const movieData = {
          _id: new mongoose.Types.ObjectId(),
          kind: data.kind,
          trackName: data.trackName,
          releaseDate: data.releaseDate,
          artistName: data.artistName,
          image: data.image,
          previewUrl: data.previewUrl,
          collectionId: data.collectionId,
          trackId: data.trackId,
          collectionName: data.collectionName,
          ranking: data.ranking,
          isDeleted: data.isDeleted,
          creator: userInfo
        }
        await userInfo.musicsList.push(movieData)
        const updateMediaTable = new MediaModel(movieData)
        await updateMediaTable.save()
        // await userInfo.save()
      }

      const savedUserInfo = await userInfo.save()

      res.status(200).json({
        savedUserInfo
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: e
      })
    }
  },

  setMovies: async (req, res) => {
    try {
      const Id = req.body.Id.trim().toLowerCase()
      const Data = req.body.data
      const userInfo = await UserModel.findById(Id)

      var dataLength = Data.length
      for (var i = 0; i < dataLength; i++) {
        const data = Data[i]
        const movieData = {
          _id: new mongoose.Types.ObjectId(),
          kind: data.kind,
          trackName: data.trackName,
          releaseDate: data.releaseDate,
          artistName: data.artistName,
          image: data.image,
          previewUrl: data.previewUrl,
          collectionId: data.collectionId,
          trackId: data.trackId,
          collectionName: data.collectionName,
          ranking: data.ranking,
          isDeleted: data.isDeleted,
          creator: userInfo
        }

        await userInfo.moviesList.push(movieData)
        const updateMediaTable = new MediaModel(movieData)
        await updateMediaTable.save()
        // movieData.save()
      }

      const savedUserInfo = await userInfo.save()

      res.status(200).json({
        savedUserInfo
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: e
      })
    }
  },
  emptyMedia: async (req, res) => {
    try {
      const Id = req.body.Id.trim().toLowerCase()
      if (req.body.location === 'musicsList') {
        await UserModel.findOneAndUpdate({ _id: Id }, { $set: { musicsList: [] } })
        res.status(200).json({
          data: 'empty'
        })
      } else {
        await UserModel.findOneAndUpdate({ _id: Id }, { $set: { moviesList: [] } })
        res.status(200).json({
          data: 'empty'
        })
      }
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: e
      })
    }
  },
  getAllMedia: async (req, res) => {
    try {
      const allMedia = await MediaModel.find({})
      res.status(200).json({
        allMedia: allMedia
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: e
      })
    }
  },

  deleteMedia: async (req, res) => {
    const Id = req.body.Id.trim().toLowerCase()
    try {
      await MediaModel.findOneAndUpdate({ _id: Id }, { $set: { isDeleted: true } }, (err) => {
        if (err) {
          console.log(err)
        } else {
          res.status(200).json({
            mediaStatus: 'deleted'
          })
        }
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: e
      })
    }
  },

  changeEmailAddress: async (req, res) => {
    const Id = req.body.Id.trim().toLowerCase()
    const newEmail = req.body.newEmail.trim().toLowerCase()
    try {
      await UserModel.findOneAndUpdate({ _id: Id }, { $set: { emailAddress: newEmail } }, (err) => {
        if (err) {
          console.log(err)
        } else {
          res.status(200).json({
            user: 'email Changed'
          })
        }
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({
      error: e
      })
    }
  },

  changePassword: async (req, res) => {
    const Id = req.body.Id.trim().toLowerCase()
    const newPassword = req.body.newPassword
    try {
      await UserModel.findOneAndUpdate({ _id: Id }, { $set: { passWord: newPassword } }, (err) => {
        if (err) {
          console.log(err)
        } else {
          res.status(200).json({
            user: 'password Changed'
          })
        }
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: e
      })
    }
  },
  changeNotification: async (req, res) => {
    const Id = req.body.Id.trim().toLowerCase()
    const newStatus = req.body.newStatus
    try {
      await UserModel.findOneAndUpdate({ _id: Id }, { $set: { sendNotifications: newStatus } }, (err) => {
        if (err) {
          console.log(err)
        } else {
          res.status(200).json({
            user: 'notification Changed'
          })
        }
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: e
      })
    }
  },
  sendMessageToUs: async (req, res) => {
    const userId = req.body.Id.trim().toLowerCase()
    const message = req.body.message
    try {
      const feedback = new Feedback({
        _id: new mongoose.Types.ObjectId(),
        message: message,
        creator: userId
      })

      const updated = await feedback.save()
      if (updated) {
        res.status(200).json({
          user: 'message sent'
        })
      }
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: e
      })
    }
  },
  changeUserInfo: async (req, res) => {
    const Id = req.body.Id.trim().toLowerCase()
    const newUserName = req.body.newUserName
    const newBio = req.body.newBio
    const newImage = req.body.newProfileImage

    try {
      await UserModel.findOneAndUpdate({ _id: Id }, { $set: { userName: newUserName, bio: newBio, imageUrl: newImage } }, (err) => {
        if (err) {
          console.log(err)
        } else {
          res.status(200).json({
            user: 'userinfo Changed'
          })
        }
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: e
      })
    }
  }
}
