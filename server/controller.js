const getNaverDict = require('../API/GetDict');

module.exports = {
    dict: (req, res) => {
        const { query } = req.query
        if (query) {
            getNaverDict(query)
                .then(dict => res.status(200).send(dict))
                .catch(err => res.status(500).send(err));
        } else {
            res.send({
                errorMessage: '단어를 입력해주세요.',
                error: true
            });
        }
    }
};
