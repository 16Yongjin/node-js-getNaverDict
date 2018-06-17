const preprocess = (query) =>
  query.trim().toLowerCase()
    .replace(/amente$/, 'o')
    .replace(/(ões)|(ães)|(ãos)$/, 'ão')
    .replace(/([aeiou])ns$/, '$1m')

module.exports = { preprocess }