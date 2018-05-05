const preprocess = (query) => {
    return query.replace(/amente$/, 'o')
         .replace(/(ões)|(ães)|(ãos)$/, 'ão')
         .replace(/([aeiou])ns$/, '$1m')
}

module.exports = { preprocess }