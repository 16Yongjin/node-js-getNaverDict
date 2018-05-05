const { getVerbRoot } = require('./GetVerbRoot')
const { getDictAgain } = require('./GetNaverDict')
const { getRoots } = require('./GetRootJson')

const getPPRoot = (query) => query.replace(/(a|i)(do$)|(da$)|(dos$)|(das$)/, '$1r')
const removeS = (query) => query.replace(/s$/, '')
const getSigular = (query) => query.replace(/(a$)|(os$)|(as$)/, 'o')

const getRoot = async (query) => {
    if (getRoots(query)) {
        // console.log('get root from json', query, getRoots(query)[0])
        return getDictAgain(getRoots(query)[0])
    }

    const promises = [getVerbRoot(query)]
    if (getPPRoot(query) !== query)
        promises.push(getDictAgain(getPPRoot(query)))
    else {
        if (removeS(query) !== query)
            promises.push(getDictAgain(removeS(query)))
        if (getSigular(query) !== query)
            promises.push(getDictAgain(getSigular(query)))
    }

    const [verbRoot, otherRoot, anotherRoot] = await Promise.all(promises)
    return (verbRoot) ? getDictAgain(verbRoot) : 
        otherRoot && !otherRoot.error ? otherRoot :
        anotherRoot && !anotherRoot.error ? anotherRoot :
        { error: 'Word Not found' }
    
}

module.exports = { getRoot }
