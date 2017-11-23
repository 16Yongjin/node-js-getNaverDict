const { parseNaverDict, parseUserDict  } = require('../API/ParseDict');

describe('사전데이터 파싱 테스트', () => {
  it('should catch error on wrong input', (done) => {
    const wrongInput = { 
    searchResul1t:
     { searchEntryList:
        { query: '똑똑',
          queryRevert: '',
          searchTarget: 'entry',
          patternQuery: '',
          total: 10,
          end: 1,
          start: 1,
          page: 0,
          pageSize: 0,
          totalPage: 0,
          startRow: 0 },
     }
    }
    parseNaverDict(wrongInput)
      .then(res => {
        console.log(res);
        done();
      })
      .catch(err => {
        console.log(err);
        done();
      })
  })
})