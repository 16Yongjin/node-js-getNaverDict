const { getKoToPT, parseKoToPt } = require('./API/GetKoToPt');
getKoToPT('똑똑').then(dict => {
    var a = dict.searchResult.searchEntryList.items;
    const parsed = parseKoToPt(dict);
    console.log(parsed);

})
