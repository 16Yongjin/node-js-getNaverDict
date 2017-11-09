const assert = require('assert');
const request = require('supertest');
const { getDict } = require('../API/GetNaverDict');
const { getVerbRoot } = require('../API/GetVerbRoot');
const { parseNaverDict, parseUserDict  } = require('../API/ParseDict');
const { getKoToPtDict } = require('../API/GetKoToPt');
const { NaverPortugueseDictionary } = require('../API/GetDict');

describe('사전 가져오기 테스트', () => {
    it('should get dictionary on valid input', (done) => {
        getDict('dia')
            .then(dict => {
                assert(dict.phoneticSigns === '[지아]');
                done();
            });
    });

    it('should get verb root', (done) => {
        getVerbRoot('passaria')
            .then(root => {
                assert(root.root === 'passar')
                done();
            });
    });

    it('should get PT word from KO', (done) => {
        getKoToPtDict('고기')
            .then(dict => {
                assert(dict.meanings[0] === '(동물의) carne')
                done();
            });
    })

    it('should get PT entry word from KO', (done) => {
        getKoToPtDict('치킨')
            .then(dict => {
                assert(dict.meanings[0] === 'frango');
                done();
            });
    })

})
