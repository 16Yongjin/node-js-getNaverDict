const _ = require('partial-js')
const mongoose = require('mongoose')
const Dict = mongoose.model('Dict')
const request = require('request-promise').defaults({ json: true })
const { parseNaverDict, parseUserDict, pluralCheck  } = require('./ParseDict')
const dictUrl = 'http://ptdic.naver.com/api/ptko'
const isEntry = ({ exactMatcheEntryUrl }) => exactMatcheEntryUrl && exactMatcheEntryUrl !== "false"
const getDict = async (query) => {
  const dict = await getNaverDict(query)
  if (isEntry(dict))
    return entryDict(dict)
  const plural = pluralCheck(dict)
  if (plural) {
    const pluralDict = await getDictAgain(plural)
    return { ...pluralDict, stemmed: true }
  } else {
    return parseNaverDict(dict)
  }
}

const getDictAgain = async (query) => {
  const cachedDict = await Dict.findOne({ entry: query })
  if (cachedDict) return cachedDict

  const dict = await getNaverDict(query)
  return isEntry(dict) ? entryDict(dict) : parseNaverDict(dict)
}

const getDictURL = (query) => `${dictUrl}/search.nhn?dictName=alldict&query=${encodeURIComponent(query)}`
const getNaverDict = _.pipe(getDictURL, request)

const entryDict = ({ exactMatcheEntryUrl }) => 
    exactMatcheEntryUrl.includes('/entry/') ? naverEntryDict(exactMatcheEntryUrl) : userEntryDict(exactMatcheEntryUrl)

const entryDictURL = (entry) => `${dictUrl}/entry.nhn?meanType=default&entryId=${encodeURIComponent(entry)}`
const naverEntryId = entry => entry.replace('/ptkodict/ko/entry/ptko/', '')
const naverEntryDict = _.pipe(naverEntryId, entryDictURL, request, parseNaverDict)

const userEntryURL = (entry) => `${dictUrl}/userEntry.nhn?lh=true&entryId=${encodeURIComponent(entry)}`
const userEntryId = entry => entry.replace('/ptkodict/ko/userEntry/ptko/', '')
const userEntryDict = _.pipe(userEntryId, userEntryURL, request, parseUserDict)

module.exports = { getDict, getDictAgain }