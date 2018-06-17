const _ = require('partial-js')
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

const trimS = query => query.replace(/s$/, '')

const getVerbRoot = async (query) => _.go(query, trimS, url, request, _(validdate, _, query))

// getVerbRoot('fala').then(console.log)

module.exports = { getVerbRoot }