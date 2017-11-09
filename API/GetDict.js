const { getDict } = require('./GetNaverDict');
const { getVerbRoot } = require('./GetVerbRoot');
const { getKoToPtDict } = require('./GetKoToPt');
const { getRoot } = require('./GetRoot');
const { preprocessQuery } = require('./Preprocess');

const getPTDict = query => getDict(query)
    .then(res => (res.error ? getRoot(query) : res))
    .catch(err => err)


const NaverPortugueseDictionary = (query) => 
    (/[가-힣]+/.test(query)) ?
        getKoToPtDict(query) :
        getPTDict(preprocessQuery(query)) 

module.exports = NaverPortugueseDictionary;
