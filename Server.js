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

const port = process.env.PORT || 2000

app.listen(port, () => {
  console.log('connected')
})
