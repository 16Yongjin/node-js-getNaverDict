const request = require('request');
const {parts} = require('./partOfSpeech');

const getNaverDict = (keyword, callback) => {
    const url = 'http://ptdic.naver.com/api/pt/search.nhn?dictName=alldict&query=' + encodeURIComponent(keyword.toLowerCase());
    request({
        url: url,
        json: true
    }, function (error, response, body) {

    
        if (!error && response.statusCode === 200) {
            console.log('processing : ' , keyword);            
            if (body.exactMatcheEntryUrl !== "false") {
                getNaverEntryDict(body.exactMatcheEntryUrl.replace("/#entry/", ""), callback); // 엔트리가 있으면 엔트리로 검색함
                return;
            } else {

                const isPlural = pluralCheck(body); // 복수형이나 여성형이면 원형 찾아서 검색함 (불완전)
                // console.log(body.query + " isPlural? :" + isPlural);
                if (!!isPlural) {
                    reGetNaverDict(isPlural, callback);
                    return;
                }

                const searchResult = body.searchResult;
                const searchEntryList = searchResult.searchEntryList;
            
                if (searchResult === null || searchResult.hasResult === false || searchEntryList.total === 0 || searchEntryList.items.filter(item => item.dicType === 2).length === 0) {
                    getVerbRoot(body.query, callback); // 동사원형 찾아서 다시 검색함
                    return;
                }
                parseNaverDict(body, callback); // 2번 타입 사전이 있다면 그대로 파싱해서 내보냄
            }
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

    let dict = new Object();    
    if (searchResult === null || searchResult.hasResult === false || searchEntryList.total === 0 ||searchEntryList.items === null) {
        dict.error = true;
        callback(dict);
        return;
    }

    const items = searchEntryList.items.filter(item => item.dicType === 2)[0];

    if (!items) {
        dict.error = true;
        callback(dict);
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

    dict.error = false;
    callback(dict);
}


const pluralCheck = (body) => {
    const searchResult = body.searchResult;
    const searchEntryList = searchResult.searchEntryList;
    
    if (searchResult === null || searchResult.hasResult === false || searchEntryList.total === 0 ||searchEntryList.items === null) {
        return false;
    }

        const dictType3Items = searchEntryList.items.filter(item => item.dicType === 3);
        let isPlural = false;
        if (dictType3Items.length > 0) {
            dictType3Items.forEach(item => {
                item.meanList.forEach(mean => {
                    if (mean.value.includes('plural de') || mean.value.includes('feminino de')) {
                        const res = mean.value.split(' ');
                        isPlural = res[res.length-1];
                    } 
                })
            });
            return isPlural;
        }
        return false;
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
                reGetNaverDict(res[0].V, callback);
            }
        }
    });
}

const reGetNaverDict = (keyword, callback) => {
    const url = 'http://ptdic.naver.com/api/pt/search.nhn?dictName=alldict&query=' + encodeURIComponent(keyword.toLowerCase());
    request({
        url: url,
        json: true
    }, function (error, response, body) {

    
        if (!error && response.statusCode === 200) {
            console.log('processing : ' , keyword);            
            if (body.exactMatcheEntryUrl !== "false") {
                getNaverEntryDict(body.exactMatcheEntryUrl.replace("/#entry/", ""), callback);
                return;
            } else {
                const searchResult = body.searchResult;
                const searchEntryList = searchResult.searchEntryList;
            
                if (searchResult === null || searchResult.hasResult === false || searchEntryList.total === 0 ||searchEntryList.items === null) {
                    return;
                }
                parseNaverDict(body, callback);
            }
        }
        
    });
}


module.exports = {getNaverDict};


// const test = `As Forças Armadas apoiadas pelo Exército brasileiro realizaram uma grande operação contra o crime organizado nas favelas de Niterói, região metropolitana do Rio de Janeiro, na manhã desta quarta-feira, em uma nova demonstração de força para tentar combater a onda de violência que atinge o estado.
// A operação em Niterói começou às 5h00.
// "O Exército tem a missão de controlar o acesso de certas favelas e os soldados foram colocados em pontos estratégicos. Algumas ruas estão bloqueadas e o espaço aéreo é controlado", informaram os serviços de segurança do Rio em um comunicado.
// O governo brasileiro mobilizou 10 mil soldados para fortalecer a segurança do Rio, especialmente diante da multiplicação do roubo de caminhões de carga.
// Segundo a Globo News, a operação conta com 2.600 militares e seu objetivo é cumprir o mandato de prisão de 26 suspeitos e realizar a condução coercitiva de outras 34 pessoas.
// Segundo a fonte, um soldado foi ferido com arma de fogo, mas a informação ainda não foi confirmada oficialmente.
// O Exército já realizou uma operação parecida este mês, utilizando 5.000 efetivos na zona norte do Rio, na tentativa de desarticular um bando que roubava caminhões com mercadoria. Na ação, morreram duas pessoas.
// O Rio registra o maior nível de violência desde 2009, com 3.457 homicídios, a mais que no mesmo período de 2016, de acordo com dados do Instituto de Segurança Pública (ISP).
// Um ano depois de receber os Jogos Olímpicos, a "Cidade Maravilhosa" está em um período decadente, entre insegurança, escândalos de corrupção e uma grave crise financeira que impede as autoridades locais de pagar funcionários, incluindo a polícia.`
// .split(' ');

// test.map(i => getNaverDict(i, j => console.log(j)));

// const test2 = `gatos`.split(' ');
// test2.map(i => getNaverDict(i, j => console.log(j)));

// getNaverDict("bom dia", function(i) {console.log(i)});
// getVerbRoot('impede', i=>console.log(i));
