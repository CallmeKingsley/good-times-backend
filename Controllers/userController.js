const UserModel = require('../Models/userModel')
const MediaModel = require('../Models/mediaModel')
const mongoose = require('mongoose')

module.exports = {
    loginUser: async (req, res) => {
        try {
          const userName = req.body.userName.trim().toLowerCase()
          const passWord = req.body.password.trim()
          const user = await UserModel.findOne({ userName, passWord }).populate({ path: 'moviesList', model: 'media' }).populate({ path: 'musicsList', model: 'media' })
          if (user) {
            //await UserModel.findOneAndUpdate({ email: emailAddress }, { $set: { lastLoginDate: new Date() } })
            res.status(200).json({
              user: user
            })
          }else{
            res.status(504).json({
                user: []
              })
          }
        } catch (err) {
          res.status(204).json({
            error: err
          })
        }
    },
    addUser: async (req, res) => {
        try {
          const newUser = new UserModel({
            _id: new mongoose.Types.ObjectId(),
            emailAddress: req.body.email,
            userName: req.body.userName,
            passWord: req.body.password
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
        const allUser = await UserModel.find({}).populate({ path: 'moviesList', model: 'media' }).populate({ path: 'musicsList', model: 'media' })
        res.status(200).json({
           allUser
        })
    },
    getUser: async (req, res) => {
        const Id = req.params.Id.trim().toLowerCase()
        try{
            const User = await UserModel.find({ _id: Id }).populate({ path: 'moviesList', model: 'media' }).populate({ path: 'musicsList', model: 'media' })
            res.status(200).json({
                User
            })
        }catch(e){
            console.log(e)
        }
       
    },
    searchUsers: async (req, res) => {
        const name = req.body.searchName
        console.log(req.body)
        
        try{
            const User = await UserModel.find({ userName: { $regex: name, $options: "i" }}).populate({ path: 'moviesList', model: 'media' }).populate({ path: 'musicsList', model: 'media' })
            res.status(200).json({
                User
            })
        }catch(e){
            console.log(e)
        }
       
    },
    getFollowerMedia: async (req, res) => {
        try{
            const Id = req.body.Id.trim().toLowerCase()
            const users = await UserModel.find({ _id: Id })
            res.status(200).json({
             allMovies: users.moviesList,
             allMusics: users.musicList
            })
        } catch(e){
            res.status(500).json({
                error: e
            })
        }
    },
    logOut: async (req, res) => {
        try{
            const emailAddress = req.body.email.trim().toLowerCase()
            await UserModel.findOneAndUpdate({ email: emailAddress }, { $set: { logOut: false} })
            res.status(200).json({
            user: user
            })
        } catch(e){
            res.status(500).json({
                error: e
            })
        }
    },
    deleteAccount: async (req, res) => {
        try{
            const emailAddress = req.body.email.trim().toLowerCase()
            await UserModel.findOneAndUpdate({ email: emailAddress }, { $set: { deleteAccount: true} })
            res.status(200).json({
            user: user
            })
        } catch(e){
            res.status(500).json({
                error: e
            })
        }
    },
    setMusic: async (req, res) => {
        try{
            const Id = req.body.Id.trim().toLowerCase()
            const data = req.body.appData.Data

            const userInfo = await UserModel.findById(Id)
           
            const musicData = new MediaModel ({
                _id: new mongoose.Types.ObjectId(),
                kind: data.kind,
                trackName: data.trackName,
                releaseDate: data.releaseDate,
                artistName: data.artistName,
                image : data.image,
                previewUrl: data.previewUrl,
                collectionId:data.collectionId,
                trackId: data.trackId,
                collectionName: data.collectionName,
                ranking:data.ranking
            })

            userInfo.musicsList.push(musicData)
            await userInfo.save()

            musicData.creator = userInfo
            await musicData.save()

            res.status(200).json({
                musicData
            })
            
        } catch(e){
            console.log(e)
            res.status(500).json({
                error: e
            })
        }
    },
    
    setMovie: async (req, res) => {
        try{
            const Id = req.body.Id.trim().toLowerCase()
            const data = req.body.appData.Data

            const userInfo = await UserModel.findById(Id)
            
            const movieData = new MediaModel ({
                _id: new mongoose.Types.ObjectId(),
                kind: data.kind,
                TrackName: data.trackName,
                releaseDate: data.releaseDate,
                artistName: data.artistName,
                image : data.image,
                previewUrl: data.previewUrl,
                collectionId:data.collectionId,
                trackId: data.trackId,
                collectionName: data.collectionName,
                ranking:data.ranking
            })

            userInfo.moviesList.push(movieData)
            await userInfo.save()

            movieData.creator = userInfo
            await movieData.save()

            res.status(200).json({
                movieData
            })
            
        } catch(e){
            console.log(e)
            res.status(500).json({
                error: e
            })
        }
    },

    setMusics: async (req, res) => {
        try{
            const Id = req.body.Id.trim().toLowerCase()
            const Data = req.body.data
            const userInfo = await UserModel.findById(Id)
            var dataLength = Data.length

            //save the updated media to user table
            for(var i = 0; i < dataLength;i++){
                  const data = Data[i]
                  const movieData = {
                    _id: new mongoose.Types.ObjectId(),
                    kind: data.kind,
                    TrackName: data.trackName,
                    releaseDate: data.releaseDate,
                    artistName: data.artistName,
                    image : data.image,
                    previewUrl: data.previewUrl,
                    collectionId:data.collectionId,
                    trackId: data.trackId,
                    collectionName: data.collectionName,
                    ranking:data.ranking,
                    creator: userInfo
                }
                await userInfo.musicsList.push(movieData)
                const updateMediaTable = new MediaModel(movieData)
                await updateMediaTable.save()
                //await userInfo.save()
            }   


            const savedUserInfo = await userInfo.save()

            res.status(200).json({
                savedUserInfo
            })
        } catch(e){
            console.log(e)
            res.status(500).json({
                error: e
            })
        }
    },
    
    setMovies: async (req, res) => {
        try{
            const Id = req.body.Id.trim().toLowerCase()
            const Data = req.body.data
            const userInfo = await UserModel.findById(Id)

           var dataLength = Data.length
           for (var i = 0; i < dataLength; i++) {
                const data = Data[i]
                const movieData = {
                    _id: new mongoose.Types.ObjectId(),
                    kind: data.kind,
                    TrackName: data.trackName,
                    releaseDate: data.releaseDate,
                    artistName: data.artistName,
                    image : data.image,
                    previewUrl: data.previewUrl,
                    collectionId:data.collectionId,
                    trackId: data.trackId,
                    collectionName: data.collectionName,
                    ranking:data.ranking,
                    creator: userInfo
                }
            
                await userInfo.moviesList.push(movieData)
                const updateMediaTable = new MediaModel(movieData)
                await updateMediaTable.save()
                //movieData.save()
           }
          
           const savedUserInfo = await userInfo.save()

           res.status(200).json({
            savedUserInfo
           })
        } catch(e){
            console.log(e)
            res.status(500).json({
                error: e
            })
        }
    },
    emptyMedia: async (req, res) => {
       try{
           const Id = req.body.Id.trim().toLowerCase()
           if(req.body.location === 'musicsList'){
                await UserModel.findOneAndUpdate({ _id: Id }, { $set: {musicsList : []} })
                res.status(200).json({
                    data: 'empty'
                })
           }else{
                await UserModel.findOneAndUpdate({ _id: Id }, { $set: {moviesList : []} })
                res.status(200).json({
                    data: 'empty'
                })
           }  
        }catch(e){
            console.log(e)
            res.status(500).json({
                error: e
            })
       }
    }
}