const request = require('request');

const VerbRootOptions = (query) => {
    const url = `https://cooljugator.org/search/pt/${encodeURIComponent(query)}`;
    return  { url, json: true }
}

const validdateVerbRoot = (body, query) => {
    const results = body.results;
    if (results.length > 0) {
        const root = results.find(item => item.title === query)
        return root ? root.price : false
    } else {
        return false
    }
}

/**
 * Get Verb root from cooljugator.com
 * @param {String} query
 */

const getVerbRoot = (query) => {
    query = query.replace(/s$/, '');
    return new Promise((resolve, reject) => {
        request(VerbRootOptions(query), (error, response, body) => 
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