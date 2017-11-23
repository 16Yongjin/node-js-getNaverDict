const request = require('request');
const { parseUserDict } = require('./ParseDict');

const isEntry = (body) => body.exactMatcheEntryUrl !== "false";

const getKoToPtDict = (query) => 
    getKoToPT(query)
        .then(dict => isEntry(dict) ?  getKoToPtEntryDict(dict.exactMatcheEntryUrl) : parseKoToPt(dict));

const KoToPTURL = (query) => `http://ptdic.naver.com/api/pt/search.nhn?dictName=alldict&query=${encodeURIComponent(query)}`;
const getKoToPT = (query) => 
    new Promise((resolve, reject) => {
        const url = KoToPTURL(query)
        request({ url, json: true },(error, response, body) => 
                (!error && response.statusCode === 200) ? 
                    resolve(body) :
                    reject({ error: true, errorMessage: 'Server Not Found' })
                )
    });


const getKoToPtEntryDict = (entryURl) => 
    (entryURl.includes('/#entry/')) ?
    getKoToPtNaverEntryDict(entryURl.replace('/#entry/', '')) :
    getKoToPtUserEntryDict(entryURl.replace('/#userEntry/', ''))

    
const KoToPtNaverEntryDictURL = (entry) => `http://ptdic.naver.com/api/pt/entry.nhn?meanType=default&groupConjugation=false&entryId=${entry}`;
const getKoToPtNaverEntryDict = (entry) => new Promise((resolve, reject) => {
        const url = KoToPtNaverEntryDictURL(entry);
        request({ url, json: true }, (err, res, body) => 
            (!err && res.statusCode === 200) ?
                resolve(parseKoToPt(body)) :
                reject({
                    error: true,
                    errorMessage: 'Server Not Found'
                })
        );
    });

const KoToPtUserEntryDictURL = (userEntry) => `http://m.ptdic.naver.com/api/pt/userEntry.nhn?lh=true&hid=150300002723430560&entryId=${userEntry}`;
const getKoToPtUserEntryDict = (userEntry) => new Promise((resolve, reject) => {
        const url = KoToPtUserEntryDictURL(userEntry)
        request({ url, json: true }, (err, res, body) => 
            (!err && res.statusCode === 200) ?
                resolve(parseUserDict(body)) :
                reject({
                    error: true,
                    errorMessage: 'Server Not Found'
                })
        );
    });


const parseKoToPt = (body) => {
    return new Promise((resolve, reject) => {
        const searchResult = body.searchResult;
        const searchEntryList = searchResult.searchEntryList;   
        if (
            !searchResult ||
            !searchResult.hasResult ||
            !searchEntryList.total ||
            !searchEntryList.items.length
        ) {
            return reject({ error: true, errorMessage: 'Word Not found' });
        }

        let items = searchEntryList.items.filter(item => item.dicType === 1)
            .filter(item => item.entry.replace(/<\/?strong>/g, '') === body.query);

        if (!items || !items.length) {
            return reject({ error: true, errorMessage: 'Word Not found' });
        }

        let dict = {
            entry: searchEntryList.query,
            phoneticSigns: '',

        };
        dict.meanings = items.map(item => { return { value: item.meanList[0].value }});
        dict.error = false;
        return resolve(dict);
    });
};

module.exports = { getKoToPT, getKoToPtDict, getKoToPtUserEntryDict, parseKoToPt };
