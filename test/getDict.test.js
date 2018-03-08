const assert = require('assert')
const request = require('supertest')
const { getDict } = require('../API/GetNaverDict')
const { getVerbRoot } = require('../API/GetVerbRoot')
const { parseNaverDict, parseUserDict  } = require('../API/ParseDict')
const { getKoToPtDict, getKoToPtUserEntryDict } = require('../API/GetKoToPt')
const  API = require('../API/GetDict')
const { getRoot } = require('../API/GetRoot')


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

    test('should get praticado\'s root praticar', async () => {
        const dict = await getRoot('praticado')
        expect(dict.entry).toEqual('praticar')
        expect(firstMean(dict)).toEqual('늘 행(行)하다. 실행하다. 실천하다.')
    })

    test('sorria', async () => {
        const dict = await API('sorria')
        expect(dict.entry).toEqual('sorrir')
    })

})
