const express = require('express')
const mongoose = require('mongoose')
const port = process.env.PORT || 3000

require('../model/dict')
require('../model/query')

mongoose.Promise = global.Promise
mongoose.connect(`mongodb://localhost:27017/ptdict`)

var app = express()
require('../routes/dictRouters')(app)
app.listen(port, () => console.log(`Server is up on port ${port}`))

module.exports = app
