const { parts } = require('./partOfSpeech');

const isHangeul = query => /[가-힣]+/.test(query)
const removeTag = entry => entry.replace(/<\/?strong>/g, '')
const parseNaverDict = (body) => {
    try {
        const { searchResult } = body
        const { searchEntryList } = searchResult
        const items = searchEntryList.items.find(({dicType}) => dicType === 2)
        const entry = removeTag(items.entry)
        
        const phoneticSigns = items.phoneticSigns[0] && `[${items.phoneticSigns[0]}]` 
        
        const meanings = items.meanList.map(({ partOfSpeech, value }) => {
            partOfSpeech = isHangeul(partOfSpeech) ? `[${partOfSpeech}]` : parts[partOfSpeech] && `[${parts[partOfSpeech]}]`;
            return { value, partOfSpeech }
        })
        
        return { entry, phoneticSigns, meanings }
    } catch (e) {
        const error = 'Word not found. Parsing Error'
        console.log('parseNaverDict error', e)
        return { error }
    }
}

const parseUserDict = ({ opendicData }) => {
    return {
        type: 'userDict',
        entry: opendicData.entryName,
        phoneticSigns: '',
        meanings: [{
            value: opendicData.means[0].mean.trim(),
            partOfSpeech: ''
        }]
    }
}

const pluralCheck = (body) => {
    try {
        const searchResult = body.searchResult
        const searchEntryList = searchResult.searchEntryList
        const items = searchEntryList.items.filter(({ dicType }) => dicType === 3);
        items.forEach(({ meanList }) => {
            meanList.forEach(({ value }) => {
                if (value.includes('plural de') || value.includes('feminino de')) {
                    return value.split(' ').slice(-1)
                }
            })
        })
    } catch (e) {
        console.log('pluralCheck error', body.query, e)
        return false
    }
}

module.exports = { parseNaverDict, parseUserDict, pluralCheck };
