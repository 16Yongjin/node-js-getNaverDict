const request = require('request-promise').defaults({ json: true })

const url = (query) => `https://cooljugator.org/search/pt/${encodeURIComponent(query)}`

const validdate = ({ results }, query) => {
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
const getVerbRoot = async (query) => {
    query = query.replace(/s$/, '');
    try {
        const body = await request(url(query))
        return validdate(body, query)
    } catch (e) {
        const error = 'Verb Server Not Found'
        console.log(error)
        return { error }
    }
};

module.exports = { getVerbRoot }