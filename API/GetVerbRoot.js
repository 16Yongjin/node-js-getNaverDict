const request = require('request');

const VerbRootOptions = (query) => {
    const url = 'http://139.59.159.204:30000/api/';
    const headers = {
        Pragma:'no-cache',
        Origin:'http://cooljugator.com',
        'Accept-Encoding':'gzip, deflate',
        'Accept-Language':'en-US,en;q=0.8,ko;q=0.6,pt;q=0.4',
        'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
        Accept: '*/*',
        'Cache-Control':'no-cache',
        Referer:'http://cooljugator.com/pt',
        Connection:'keep-alive'
    };
    const body = 'language=pt&verb=' + query;
    
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
    query = query.replace(/s$/, '');
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