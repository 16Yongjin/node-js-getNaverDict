const _ = require('partial-js')
const fs = require('mz/fs')

const getJson = _.pipe(fs.readFile, JSON.parse)
const rootIndex = {}
_.go(getJson(`${__dirname}/roots.json`), _(Object.assign, rootIndex, _))
const getRoots = verbs => rootIndex[verbs]

module.exports = { getRoots }