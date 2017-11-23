const assert = require('assert');
const request = require('supertest');
const { getDict } = require('../API/GetNaverDict');
const { getVerbRoot } = require('../API/GetVerbRoot');
const { parseNaverDict, parseUserDict  } = require('../API/ParseDict');
const { getKoToPtDict, getKoToPtUserEntryDict } = require('../API/GetKoToPt');
const { NaverPortugueseDictionary } = require('../API/GetDict');

describe('사전 가져오기 테스트', () => {
    xit('should get dictionary on valid input', (done) => {
        getDict('dia')
            .then(dict => {
                assert(dict.phoneticSigns === '[지아]');
                console.log('dia', dict);
                done();
            })
            .catch(err => {
                console.log('dia', err);
                done();
            })
    });

    it('should get dictionary on 똑똑', (done) => {
        getDict('똑똑')
            .then(dict => {
                // console.log('똑똑', dict);
                done();
            })
            .catch(err => {
                console.log(err);
                done();
            })
    });

    xit('should get verb root', (done) => {
        getVerbRoot('passaria')
            .then(root => {
                assert(root.root === 'passar')
                done();
            });
    });

    it('should get PT word from KO 고기', (done) => {
        getKoToPtDict('고기')
            .then(dict => {
                assert(dict.meanings[0].value === '(동물의) carne')
                done();
            });
    })

    it('should get PT entry word from KO', (done) => {
        getKoToPtDict('치킨')
            .then(dict => {
                assert(dict.meanings[0].value === 'frango');
                done();
            });
    })

    it('should get PT user entry word from KO', (done) => {
        getKoToPtDict('안녕하세요')
            .then(dict => {
                assert(dict.meanings[0].value === 'Bom dia.');
                done();
            });
    })

    it('should get PT user entry word from KO', (done) => {
        getKoToPtUserEntryDict('0f05a1c34c4c48cfc0e41b1237d38d35')
            .then(dict => {
                assert(dict.meanings[0].value === 'Bom dia.');
                done();
            });
    })

    it('should get praticado\'s root praticar', (done) => {
        getVerbRoot('praticado')
            .then(dict => {
                assert(dict.hasVerbRoot)
                done()
            }) 
    })

})
