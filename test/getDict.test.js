require('../model/dict')
require('../model/query')
const mongoose = require('mongoose')
const { getDict } = require('../API/GetNaverDict')
const { getVerbRoot } = require('../API/GetVerbRoot')
const { getRoots } = require('../API/GetRootJson')
const { getKoToPtDict, getKoToPtUserEntryDict } = require('../API/GetKoToPt')
const  API = require('../API/GetDict')
const { getRoot } = require('../API/GetRoot')

beforeAll(async () => {
    mongoose.Promise = global.Promise
    const a = getRoots('gostar')
    return mongoose.connect(`mongodb://localhost:27017/ptdict`)
})

// beforeEach((done) => {
//     const { dicts, queries } = mongoose.connection.collections
//     return Promise.all([dicts.drop(), queries.drop()])
// });


const firstMean = dict => dict.meanings[0].value

describe('사전 API 테스트', () => {
    test('dia', async () => {
        const dict = await getDict('dia')
        expect(dict.phoneticSigns).toEqual('[지아]')
    })
    test('verb root of passaria', async () => {
        const root = await getVerbRoot('passaria')
        expect(root).toEqual('passar')
    })

    test('should fail on 똑똑', async () => {
        const dict = await getKoToPtDict('똑똑')
        expect(dict).toHaveProperty('error')
    })

    test('고기', async () => {
        const dict = await getKoToPtDict('고기')
        expect(dict.meanings[0].value).toEqual('(동물의) carne')
    })

    test('Entry word 치킨', async () => {
        const dict = await getKoToPtDict('치킨')
        expect(dict.meanings[0].value).toEqual('frango')
    })

    test('User entry word 안녕하세요', async () => {
        const dict = await getKoToPtDict('안녕하세요')
        expect(dict.meanings[0].value).toEqual('Bom dia.')
    })

    test('User entry id', async () => {
        const dict = await getKoToPtUserEntryDict('0f05a1c34c4c48cfc0e41b1237d38d35')
        expect(firstMean(dict)).toEqual('Bom dia.')
    })

    test('should get ptko entry dict brincar', async () => {
        const dict = await getDict('brincar')
        expect(firstMean(dict)).toEqual('농담하다. 익살을 부리다. 놀리다. 희롱하다. 번롱(翻弄)하다. 장난하다.')
    })

    test('should get root of praticado - praticar', async () => {
        const dict = await getRoot('praticado')
        expect(dict.entry).toEqual('praticar')
        expect(firstMean(dict)).toEqual('늘 행(行)하다. 실행하다. 실천하다.')
    })

    test('should get root of passaria - passar', async () => {
        const dict = await getRoot('passaria')
        expect(dict.entry).toEqual('passar')
        expect(firstMean(dict)).toEqual('지나가게 하다. 통과시키다. 건너 보내다. 횡단시키다.')
    })

    test('should get root of sorria - sorrir', async () => {
        const dict = await API('sorria')
        expect(dict.entry).toEqual('sorrir')
    })

    test('should get algumas - algum', async () => {
        const dict = await API('algumas')
        expect(firstMean(dict)).toEqual('어떤. 어느 것인. 어떤 사람의. 약간의.')        
    })

    test('should get problemas - problema', async () => {
        const dict = await API('problemas')
        expect(firstMean(dict)).toEqual('문제. 의문. 난문(難問).')        
    })

    test('should get secretarias - secretaria', async () => {
        const dict = await API('secretarias')
        expect(firstMean(dict)).toEqual('서기관 사무소. 비서실장(秘書長室).')
    })

    test('should get entry simpático', async () => {
        const dict = await API('simpático')
        expect(firstMean(dict)).toEqual('동정하는. 인정 깊은.')
    })

    test('should get Root of from json ', async () => {
        const root = getRoots('praticado')
        expect(root[0]).toEqual('praticar')
    })

    test('simpática to simpático' , async () => {
        const dict = await API('simpática')
        expect(dict.entry).toEqual('simpático')
    })

})
