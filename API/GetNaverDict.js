const mongoose = require('mongoose')
const Dict = mongoose.model('Dict')
const request = require('request-promise').defaults({ json: true })
const { parseNaverDict, parseUserDict, pluralCheck  } = require('./ParseDict')

const isEntry = ({ exactMatcheEntryUrl }) => exactMatcheEntryUrl && exactMatcheEntryUrl !== "false"

const getDict = async (query) => {
    const dict = await getNaverDict(query)
    if (isEntry(dict))
        return getEntryDict(dict)

    const plural = pluralCheck(dict)
    return plural ? getDictAgain(plural) : parseNaverDict(dict)
}

const getDictAgain = async (query) => {
    const cachedDict = await Dict.findOne({ entry: query })

    if (cachedDict) return cachedDict

    const dict = await getNaverDict(query)
    return isEntry(dict) ? getEntryDict(dict) : parseNaverDict(dict)
}

const getDictURL = (query) => `http://ptdic.naver.com/api/ptko/search.nhn?dictName=alldict&query=${encodeURIComponent(query.trim().toLowerCase())}`
const getNaverDict = async (query) => {
    const url = getDictURL(query)
    return request(url)
}

const getEntryDict = ({ exactMatcheEntryUrl }) => {
    if (!exactMatcheEntryUrl) return { error: 'No exactMatcheEntryUrl' }

    return (exactMatcheEntryUrl.includes('/#entry/')) ?
        getNaverEntryDict(exactMatcheEntryUrl) :
        getUserEntryDict(exactMatcheEntryUrl)
}

const EntryDictURL = (entry) => `http://ptdic.naver.com/api/ptko/entry.nhn?meanType=default&groupConjugation=false&entryId=${entry}`
const getNaverEntryDict = async (entry) => {
    entry = entry.replace('/#entry/', '')
    const url = EntryDictURL(entry)
    const body = await request(url)
    return parseNaverDict(body)
}

const UserEntryURL = (entry) => 'http://m.ptdic.naver.com/api/ptko/userEntry.nhn?lh=true&hid=150300002723430560&entryId=' + encodeURIComponent(entry);
const getUserEntryDict = async (entry) => {
    entry = entry.replace('/#userEntry/', '')
    const url = UserEntryURL(entry);
    const body = await request(url)
    parseUserDict(body)
}

module.exports = { getDict, getDictAgain }