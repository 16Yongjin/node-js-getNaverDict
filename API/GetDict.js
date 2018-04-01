const { getDict } = require('./GetNaverDict');
const { getKoToPtDict } = require('./GetKoToPt');
const { getRoot } = require('./GetRoot');
const { preprocess } = require('./Preprocess');

const getPTDict = async query => {
    const res = await getDict(query)
    
    return res.entry !== query || res.error ? getRoot(query) : res
}

const isHangeul = query => /[가-힣]+/.test(query)
const NaverPortugueseDictionary = (query) => 
    (isHangeul(query)) ?
        getKoToPtDict(query) :
        getPTDict(preprocess(query)) 

// NaverPortugueseDictionary('praticado').then(d => {
//     console.log(d)
// })
// .catch(e => {
//     console.error(e)
// })

module.exports = NaverPortugueseDictionary;
