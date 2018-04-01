const fs = require('fs')
const { promisify } = require('util')

fs.appendFile = promisify(fs.appendFile)

const writeLog = (...logs) => fs.appendFile(`${__dirname}/../log.txt`, `${logs.join(', ')}\n`)

module.exports = writeLog
