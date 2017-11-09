const request = require('request');

const VerbRootOptions = (query) => {
    const url = 'http://139.59.159.204:30000/api/';
    const headers = {
        Host: '139.59.159.204:30000',
        'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:54.0) Gecko/20100101 Firefox/54.0',
        Accept: '*/*',
        'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate',
        Referer: 'http://cooljugator.com/pt',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Origin: 'http://cooljugator.com',
        Connection: 'keep-alive'
    };
    const body = 'language=pt&verb=' + query;
    // Configure the request
    return { url, headers, body };
}

const validdateVerbRoot = (body, query) => {
    const res = JSON.parse(body);
    const conjuator = res.find(v => v.forms.find(form => form.form === query));
    if (conjuator) {
        const form = conjuator.forms.find(form => form.form === query).designation;
        return { hasVerbRoot: true, query, root: conjuator.V, form };
    } else {
        return { hasVerbRoot: false, errorMessage: 'No verb root' };
    }
}

/**
 * Get Verb root from cooljugator.com
 * @param {String} query
 */

const getVerbRoot = (query) => {
    return new Promise((resolve, reject) => {
        request.post(VerbRootOptions(query), (error, response, body) => 
            (!error && response.statusCode == 200) ?
                resolve(validdateVerbRoot(body, query)) :
                reject({
                    error: true,
                    errorMessage: 'Verb Server Not Found'
                })
        );
    });
};

module.exports = { getVerbRoot }