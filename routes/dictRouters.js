const mongoose = require('mongoose')
const getNaverDict = require('../API/GetDict')
const writeLog = require('../helper/writeLog')
const Dict = mongoose.model('Dict')
const Query = mongoose.model('Query')

const preprocess = (query = '') => query.trim().toLowerCase()

module.exports = app => app.get('/api', async (req, res) => {
  const query = preprocess(req.query.query)
  if (!query)
    return res.send({ errorMessage: '단어를 입력해주세요.', error: true })

  try {
    const cachedDict = await Query.getCache(query)

    if (cachedDict) {
      return res.send(cachedDict.dict)
    }

    const dict = await getNaverDict(query)
    if (dict.error) {
      await writeLog(query, dict.error)
      return res.send({ error: true })
    }
    
    res.send(dict)
    await Query.setCache(query, dict)
  } catch (e) {
    res.status(500).send({ error: true, errorMessage: e })
  }
})