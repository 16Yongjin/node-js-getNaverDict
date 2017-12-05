const { parts } = require('./partOfSpeech');

const parseNaverDict = (body) => {
    return new Promise((resolve, reject) => {
        const searchResult = body.searchResult;
        const searchEntryList = searchResult.searchEntryList;

        if (!searchResult || !searchResult.hasResult|| !searchEntryList.total || !searchEntryList.items.length) {
            return resolve({error: true, errorMessage: 'Word Not found, Parsing Error1'});
        }
        const items = searchEntryList.items.find(item => item.dicType === 2);
        if (!items || items.length === 0) 
            return resolve({error: true, errorMessage: 'Word Not found, Parsing Error2'});
        
        const dict = {};    
        dict.entry = items.entry.replace(/<\/?strong>/g, "");

        if (items.phoneticSigns.length) {
            dict.phoneticSigns = `[${items.phoneticSigns[0]}]`;
        }

        const meanList = items.meanList

        dict.meanings = meanList.map((meaning) => {
            let partOfSpeech = meaning.partOfSpeech;
            if (partOfSpeech !== '' && parts[partOfSpeech]) {
                partOfSpeech = `[${parts[partOfSpeech]}]`;
            }
            return {
                partOfSpeech,
                value: meaning.value
            }
        })
        return resolve(dict);
    });

}

const parseUserDict = (body) => {
    return Promise.resolve(({
        error: false,
        type: 'userDict',
        entry: body.opendicData.entryName,
        phoneticSigns: '',
        meanings: [{
            value: body.opendicData.means[0].mean.trim(),
            partOfSpeech: ''
        }]
    }))
}

const pluralCheck = (body) => {
    const searchResult = body.searchResult;
    const searchEntryList = searchResult.searchEntryList;
    
    if (!searchResult || !searchResult.hasResult|| !searchEntryList.total || !searchEntryList.items)
        return false;
    
    const dictType3Items = searchEntryList.items.filter(item => item.dicType === 3);
    let isPlural;
    let designation = '';
    if (dictType3Items.length) {
        dictType3Items.forEach(item => {
            item.meanList.forEach(mean => {
                if (mean.value.includes('plural de') || mean.value.includes('feminino de')) {
                    designation = mean.value;
                    const res = mean.value.split(' ');
                    isPlural = res[res.length-1];
                } 
            })
        });
        return isPlural ? { type: designation, query: isPlural } : false
    }
    return false;
}

module.exports = { parseNaverDict, parseUserDict, pluralCheck };
