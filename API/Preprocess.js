const preprocessQuery = (query) => {
    if (query.endsWith('amente'))
        return query.replace('amente', 'o');

    if (query.endsWith('ões')) 
        return query.replace('ões', 'ão');

    return query
}

module.exports = { preprocessQuery };