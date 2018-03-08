const request = require('request-promise').defaults({ json: true })
const { parseNaverDict, parseUserDict, pluralCheck  } = require('./ParseDict')

const isEntry = ({ exactMatcheEntryUrl }) => exactMatcheEntryUrl && exactMatcheEntryUrl !== "false"

const getDict = async (query) => {
    const dict = await getNaverDict(query)
    if (isEntry(dict))
        return getEntryDict(dict.exactMatcheEntryUrl)

    const plural = pluralCheck(dict)
    return plural ? getDictAgain(plural) : parseNaverDict(dict)
}

const getDictAgain = async (query) => {
    const dict = await getNaverDict(query)
    return isEntry(dict) ? getEntryDict(dict) : parseNaverDict(dict)
}

const getDictURL = (query) => `http://ptdic.naver.com/api/pt/search.nhn?dictName=alldict&query=${encodeURIComponent(query.trim().toLowerCase())}`
const getNaverDict = async (query) => {
    const url = getDictURL(query)
    return request(url, )
}


const getEntryDict = ({ exactMatcheEntryUrl }) => {
    if (!exactMatcheEntryUrl) return { error: 'No exactMatcheEntryUrl' }

    return (exactMatcheEntryUrl.includes('/#entry/')) ?
        getNaverEntryDict(exactMatcheEntryUrl) :
        getUserEntryDict(exactMatcheEntryUrl)
}

const EntryDictURL = (entry) => `http://ptdic.naver.com/api/pt/entry.nhn?meanType=default&groupConjugation=false&entryId=${entry}`
const getNaverEntryDict = async (entry) => {
    entry = entry.replace('/#entry/', '')
    const url = EntryDictURL(entry)
    const body = request(url)
    return parseNaverDict(body)
}

const UserEntryURL = (entry) => 'http://m.ptdic.naver.com/api/pt/userEntry.nhn?lh=true&hid=150300002723430560&entryId=' + encodeURIComponent(entry);
const getUserEntryDict = async (entry) => {
    entry = entry.replace('/#userEntry/', '')
    const url = UserEntryURL(entry);
    const body = await request(url)
    parseUserDict(body)
}

module.exports = { getDict, getDictAgain }