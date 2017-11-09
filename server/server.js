const express = require('express');
const bodyParser = require('body-parser');
const controller = require('./controller');


const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.get('/api', controller.dict)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

module.exports = app;