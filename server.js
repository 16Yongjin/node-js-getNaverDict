const express = require('express');
const bodyParser = require('body-parser');
const  {getNaverDict} = require('./getDict');

const port = process.env.PORT || 3006;

var app = express();
app.use(bodyParser.json());

app.get('/dict', (req, res) => {
    const keyword = req.query.keyword;
    if (keyword) {
        getNaverDict(keyword, result => {
            res.send(result);
        })
    } else {
        res.send({
            error: 'No keyword:('
        });
    }
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
