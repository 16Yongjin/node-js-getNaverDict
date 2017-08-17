const request = require('request');
const {parts} = require('./partOfSpeech');

const getNaverDict = (keyword, callback) => {
    const url = 'http://ptdic.naver.com/api/pt/search.nhn?dictName=alldict&query=' + keyword.replace(/\s/g, '+');
    request({
        url: url,
        json: true
    }, function (error, response, body) {

    
        if (!error && response.statusCode === 200) {
            console.log('processing : ' , keyword);            
            if (body.exactMatcheEntryUrl !== "false") {
                
                getNaverEntryDict(body.exactMatcheEntryUrl.replace("/#entry/", ""), callback);
                return;
            }

            parseNaverDict(body, callback);
        }
        
    });
}

const getNaverEntryDict = (entry, callback) => {
    const url = 'http://ptdic.naver.com/api/pt/entry.nhn?meanType=default&groupConjugation=false&entryId=' + entry;
    request({
        url: url,
        json: true
    }, function (error, response, body) {
    
        if (!error && response.statusCode === 200) {
            parseNaverDict(body, callback);            
        }
        
    });
}

const parseNaverDict = (body, callback) => {
    const searchResult = body.searchResult;
    const searchEntryList = searchResult.searchEntryList;

    if (searchResult === null || searchResult.hasResult === false || searchEntryList.total === 0 ||searchEntryList.items === null) {
        getVerbRoot(body.query, callback);
        return;
    }

    let dict = new Object();
    const items = searchEntryList.items.filter(i => i.dicType === 2)[0];

    if (!items) {
        dict.error = 'Not found';
        callback(dict)
        return;
    }

    dict.entry = items.entry.replace(/<strong>(.+)<\/strong>/g, "$1");

    if (items.phoneticSigns.length > 0) {
        dict.phoneticSigns = '[' + items.phoneticSigns[0] + ']';
    }

    const meanList = items.meanList

    dict.meanings = [];
    for (let i=0; i<meanList.length; i++) {
        const meaning = meanList[i];
        let partOfSpeech = meaning.partOfSpeech;
        if (!partOfSpeech !== '' && parts[partOfSpeech]) {
            partOfSpeech = '[' + parts[partOfSpeech] + ']';
        }
        dict.meanings.push({
            partOfSpeech,
            value: meaning.value
        });
    }

    callback(dict);
}

const getVerbRoot = (keyword, callback) => {

    const url = 'http://139.59.159.204:30000/api/';

    const headers = {
        'Host':'139.59.159.204:30000',
        'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:54.0) Gecko/20100101 Firefox/54.0',
        'Accept': '*/*',
        'Accept-Language':'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding':'gzip, deflate',
        'Referer':'http://cooljugator.com/pt',
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin':'http://cooljugator.com',
        'Connection':'keep-alive'
    }

    const body = 'language=pt&verb=' + keyword.split(' ')[0];
    // Configure the request
    const options = {
        url: url,
        method: 'POST',
        headers: headers,
        body
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            
            const res = JSON.parse(body);
            
            if (res.length > 0) {
                getNaverDict(res[0].V, callback);
            }
        }
        
    });
}

getNaverDict("ostracizamos", function(i) {console.log(i)});
// getVerbRoot('impede', i=>console.log(i));

