const mongoose = require('mongoose')
const { Schema } = mongoose
const Dict = mongoose.model('Dict')

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

QuerySchema.statics.getCache = function (query) {
  return this.findOne({ query }).populate({ path: 'dict', model: 'Dict' })
}

QuerySchema.statics.setCache = async function (query, dict) {
  const existingDict = dict._id ? dict : await Dict.findOne({ entry: dict.entry })
  const newDict = existingDict || new Dict(dict)
  const newQuery = this.create({ query, dict: newDict })
  return Promise.all([newDict.save(), newQuery])
}

mongoose.model('Query', QuerySchema)
