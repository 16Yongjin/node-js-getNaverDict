const { getVerbRoot } = require('./GetVerbRoot')
const { getDictAgain } = require('./GetNaverDict')

const getPPRoot = (query) => query.replace(/(a|i)(do$)|(da$)|(dos$)|(das$)/, '$1r')
const getSigular = (query) => query.replace(/(a$)|(os$)|(as$)/, 'o').replace(/s$/, '')

const getRoot = async (query) => {
    const promises = [getVerbRoot(query)]
    if (getPPRoot(query) !== query)
        promises.push(getDictAgain(getPPRoot(query)))
    else if (getSigular(query) !== query)
        promises.push(getDictAgain(getSigular(query)))

    const [verbRoot, otherRoot] = await Promise.all(promises)
    // console.log('verbRoot, otherRoot', verbRoot, otherRoot)
    return (verbRoot) ? getDictAgain(verbRoot) : 
        otherRoot || { error: 'Word Not found' }
}

module.exports = { getRoot }
