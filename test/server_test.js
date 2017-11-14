const assert = require('assert');
const request = require('supertest');
const app = require('../server/server');


describe('사전 가져오기 서버 테스트', () => {
    xit('api sholud get dict', (done) => {
        request(app)
            .get('/api?query=dia')
            .end((err, res) => {
                assert(res.body.meanings[0].value === '날. 낮.');
                done();
            })
    });
});
