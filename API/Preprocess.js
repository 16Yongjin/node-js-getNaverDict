const preprocess = (query) => {
    return query.replace(/amente$/, 'o')
         .replace(/ões$/, 'ão')
}

module.exports = { preprocess }