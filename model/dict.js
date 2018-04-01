const mongoose = require('mongoose')
const { Schema } = mongoose

const MeaningSchema = new Schema({
  value: String,
  partOfSpeech: String
})

const DictSchema = new Schema({
  entry: {
    type: String,
    index: true
  },
  phoneticSigns: String,
  meanings: [MeaningSchema]
})

mongoose.model('Dict', DictSchema)
