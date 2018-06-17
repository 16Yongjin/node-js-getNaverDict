const { getVerbRoot } = require('./GetVerbRoot')
const { getDictAgain } = require('./GetNaverDict')
const { getRoots } = require('./GetRootJson')


const hasDict = (dict) => dict && !dict.error
const getPPRoot = (query) => query.replace(/(a|i)(do$)|(a|i)(da$)|(a|i)(dos$)|(a|i)(das$)/, '$1r')
const removeS = (query) => query.replace(/s$/, '')
const removeES = (query) => query.replace(/([rsz])es$/, '$1')
const getSigular = (query) => query.replace(/(a$)|(os$)|(as$)/, 'o')
const nToM = (query) => query.replace(/([aeiou])ns$/, '$1m')
const isTol = query => query.replace(/([aeou])is$/, '$1l')


const getVerbRootAndDict = async (query) => {
    const verbRoot = await getVerbRoot(query)
    return verbRoot ? getDictAgain(verbRoot) : { error: 'Word Not found' }
}

const getRoot = async (query) => {
    if (getRoots(query)) {
        const getRootsDict = await getDictAgain(getRoots(query)[0])
        if (!getRootsDict.error)
            return getRootsDict
    }


    const promises = []
    if (getPPRoot(query) !== query)
        promises.push(getDictAgain(getPPRoot(query)))
    else {
        if (removeS(query) !== query)
            promises.push(getDictAgain(removeS(query)))
        if (removeES(query) !== query)
            promises.push(getDictAgain(removeES(query)))
        if (getSigular(query) !== query)
            promises.push(getDictAgain(getSigular(query)))
    }

    const [otherRoot, anotherRoot] = await Promise.all(promises)
    return hasDict(otherRoot) ? otherRoot :
           hasDict(anotherRoot) ? anotherRoot :
           getVerbRootAndDict(query)
}

module.exports = { getRoot }
