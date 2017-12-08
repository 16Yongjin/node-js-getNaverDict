const { getVerbRoot } = require('./GetVerbRoot');
const { getDictAgain } = require('./GetNaverDict');

const getSigular = (query) => query.replace(/(a$)|(os$)|(as$)/, 'o').replace(/s$/, '')
const getPPRoot = (query) => query.replace(/(a|i)(do$)|(da$)|(dos$)|(das$)/, '$1r')


const getRoot = (query) => {
        const promises = [getVerbRoot(query)];
        if (getPPRoot(query) !== query)
            promises.push(getDictAgain(getPPRoot(query)));
        else if (getSigular(query) !== query)
            promises.push(getDictAgain(getSigular(query)))

        console.log(getPPRoot(query));

        return Promise.all(promises)
            .then(results => 
                (results[0]) ?
                    getDictAgain(results[0]) :
                    results[1] ? results[1] : {error: true, errorMessage: 'Word Not found'});
}

module.exports = { getRoot };
