const request = require('request');
const { parseNaverDict, parseUserDict, pluralCheck  } = require('./ParseDict');

const isEntry = (body) => body.exactMatcheEntryUrl !== "false";

const getDict = (query) =>
    getNaverDict(query)
        .then(dict => (isEntry(dict)) ?
            getEntryDict(dict.exactMatcheEntryUrl) : 
                pluralCheck(dict) ? getDictAgain(pluralCheck(dict).query) : parseNaverDict(dict))

const getDictAgain = (query) =>
    getNaverDict(query)
        .then(dict => (isEntry(dict)) ? getEntryDict(dict.exactMatcheEntryUrl) : parseNaverDict(dict))
            

const getDictURL = (query) => `http://ptdic.naver.com/api/pt/search.nhn?dictName=alldict&query=${encodeURIComponent(query.toLowerCase())}`
const getNaverDict = (query) => {
    return new Promise((resolve, reject) => {
        const url = getDictURL(query);
        request({ url, json: true }, (error, response, body) => {
            (!error && response.statusCode === 200) ?
                resolve(body) :
                reject({ error: true, errorMessage: 'Server Error' })
        });
    })
}


const getEntryDict = (EntryUrl) => 
    (EntryUrl.includes('/#entry/')) ?
        getNaverEntryDict(EntryUrl.replace('/#entry/', '')) :
        getUserEntryDict(EntryUrl.replace('/#userEntry/', ''))

const EntryDictURL = (entry) => `http://ptdic.naver.com/api/pt/entry.nhn?meanType=default&groupConjugation=false&entryId=${entry}`
const getNaverEntryDict = (entry) => {
    return new Promise((resolve, reject) => {
        const url = EntryDictURL(entry);
        request({ url , json: true}, (error, response, body) => 
            (!error && response.statusCode === 200) ?
                resolve(parseNaverDict(body)) :
                reject({ error: true, errorMessage: 'Word not found' })
        );
    });
};

const UserEntryURL = (entry) => 'http://m.ptdic.naver.com/api/pt/userEntry.nhn?lh=true&hid=150300002723430560&entryId=' + encodeURIComponent(entry);
const getUserEntryDict = (entry) => {
    return new Promise((resolve, reject) => {
        const url = UserEntryURL(entry);
        request({ url, json: true }, (error, response, body) => 
            (!error && response.statusCode === 200) ?
                resolve(parseUserDict(body)) :
                reject({ error: true, errorMessage: 'Word not found' })
        );
    })
}

module.exports = { getDict, getDictAgain }