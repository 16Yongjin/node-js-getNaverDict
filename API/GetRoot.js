const { getVerbRoot } = require('./GetVerbRoot');
const { getDictAgain } = require('./GetNaverDict');

const getSigular = (query) => query.replace(/(a$)|(os$)|(as$)/, 'o').replace(/s$/, '')
const getRoot = (query) => {
        const promises = [getVerbRoot(query)];
        if (getSigular(query) !== query)
            promises.push(getDictAgain(getSigular(query)));

        return Promise.all(promises)
            .then(results => 
                (results[0].hasVerbRoot) ?
                    getDictAgain(results[0].root) :
                    results[1] ? results[1] : {error: true, errorMessage: 'Word Not found'});
}

module.exports = { getRoot };
