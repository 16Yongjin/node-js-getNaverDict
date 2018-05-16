const request = require('request-promise').defaults({ json: true })
const { parseUserDict } = require('./ParseDict')

const isEntry = (body) => body.exactMatcheEntryUrl !== "false";

const getKoToPtDict = async (query) => {
    const dict = await getKoToPT(query)
    return isEntry(dict) ? getKoToPtEntryDict(dict) : parseKoToPt(dict)
}

const KoToPTURL = (query) => `http://ptdic.naver.com/api/ptko/search.nhn?dictName=alldict&query=${encodeURIComponent(query)}`;
const getKoToPT = (query) => {
    const url = KoToPTURL(query)
    return request(url)
}

const getKoToPtEntryDict = ({ exactMatcheEntryUrl }) => 
    exactMatcheEntryUrl.includes('/entry/') ?
        getKoToPtNaverEntryDict(exactMatcheEntryUrl) :
        getKoToPtUserEntryDict(exactMatcheEntryUrl)

    
const KoToPtNaverEntryDictURL = (entry) => `http://ptdic.naver.com/api/ptko/entry.nhn?meanType=default&groupConjugation=false&entryId=${entry}`;
const getKoToPtNaverEntryDict = async (entry) => {
    entry = entry.replace('/ptkodict/ko/entry/kopt/', '')
    const url = KoToPtNaverEntryDictURL(entry)
    try {
        const body = await request(url)
        return parseKoToPt(body)
    } catch (e) {
        const error = 'Kor entry dict url not found'
        console.error(error)
        return { error }
    }
}

const userEntryURL = (userEntry) => `http://m.ptdic.naver.com/api/ptko/userEntry.nhn?lh=true&hid=150300002723430560&entryId=${userEntry}`;
const getKoToPtUserEntryDict = async (userEntry) => {
    console.log(userEntry)
    userEntry = userEntry.replace('/ptkodict/ko/userEntry/kopt/', '')
    const url = userEntryURL(userEntry)
    try {
        const body = await request(url)
        return parseUserDict(body)
    } catch (e) {
        const error = 'KO To PT User Entry Server not found'
        console.error(error)
        return { error }
    }
}

const removeTag = entry => entry.replace(/<\/?strong>/g, '')
const parseKoToPt = ({ query, searchResult = {} }) => {
    const error = 'Word Not found'
    
    try {
        const { searchEntryList } = searchResult        
        const { items, query } = searchEntryList
        const typeOneItem = items.filter(({ dicType, entry }) => dicType === 1 && removeTag(entry) === query)
        const meanings = typeOneItem.map(item => ({ value: item.meanList[0].value }))
        
        if (meanings.length < 1)
            throw new Error(error)

        return { entry: query, phoneticSigns: '', meanings }
    } catch (e) { 
        console.log(e)
        return { error }
    }
}

module.exports = { getKoToPT, getKoToPtDict, getKoToPtUserEntryDict, parseKoToPt }
