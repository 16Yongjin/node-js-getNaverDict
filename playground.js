// const { getKoToPT, parseKoToPt } = require('./API/GetKoToPt');
// getKoToPT('똑똑').then(dict => {
//     var a = dict.searchResult.searchEntryList.items;
//     const parsed = parseKoToPt(dict);
//     console.log(parsed);

// })


const API = require('./API/GetDict');
const { getRoot } = require('./API/GetRoot');

API('helloooodf')
    .then(i => {
        console.log('API TEST', i);
    })


// getRoot('passaria')
//     .then(i => {
//         console.log(i);
//     })
//     .catch(i => {
//         console.log('in getRoot playground Error', i);
//     })

