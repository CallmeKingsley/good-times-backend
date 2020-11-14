const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('./Config')
const api = require('./Routes/api')
const app = express()

config.mongoDBConfig()

app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api', api)

app.listen(3100, () => {
  console.log('connected')
})
