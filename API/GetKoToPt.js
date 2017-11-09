const request = require('request');

const isEntry = (body) => body.exactMatcheEntryUrl !== "false";
const getEntry = (body) => body.exactMatcheEntryUrl.replace('/#entry/', '');

const getKoToPtDict = (query) => 
    getKoToPT(query)
        .then(dict => isEntry(dict) ? getKoToPtEntryDict(getEntry(dict)) : parseKoToPt(dict));

const KoToPTURL = (query) => 'http://ptdic.naver.com/api/pt/search.nhn?dictName=alldict&query='+encodeURIComponent(query.toLowerCase());
const getKoToPT = (query) => 
    new Promise((resolve, reject) => {
        const url = KoToPTURL(query)
        request({ url, json: true },(error, response, body) => 
                (!error && response.statusCode === 200) ? 
                    resolve(body) :
                    reject({ error: true, errorMessage: 'Server Not Found' })
                )
    });

const KoToPtEntryDictURL = (entry) => 'http://ptdic.naver.com/api/pt/entry.nhn?meanType=default&groupConjugation=false&entryId=' + entry;
const getKoToPtEntryDict = (entry) => new Promise((resolve, reject) => {
        const url = KoToPtEntryDictURL(entry)
        request({ url, json: true }, (err, res, body) => 
            (!err && res.statusCode === 200) ?
                resolve(parseKoToPt(body)) :
                reject({
                    error: true,
                    errorMessage: 'Server Not Found'
                })
        );
    });

const parseKoToPt = (body) => {
    const searchResult = body.searchResult;
    const searchEntryList = searchResult.searchEntryList;

    if (
        !searchResult ||
        !searchResult.hasResult ||
        !searchEntryList.total ||
        !searchEntryList.items
    ) {
        return { error: true, errorMessage: 'Word Not found' };
    }

    let items = searchEntryList.items.filter(item => item.dicType === 1)
        .filter(item => item.entry.replace(/<\/?strong>/g, '') === body.query);

    if (!items) {
        return { error: true, errorMessage: 'Word Not found' };
    }

    let dict = {
        entry: searchEntryList.query,
        phoneticSigns: '',

    };
    dict.meanings = items.map(item => item.meanList[0].value);
    dict.error = false;
    return dict;
};

module.exports = { getKoToPtDict };
