const mongoose = require('mongoose')
const { Schema } = mongoose

const QuerySchema = new Schema({
  query: {
    type: String,
    index: true
  },
  dict: {
    type: Schema.Types.ObjectId,
    ref: 'Dict'
  }
})

mongoose.model('Query', QuerySchema)
