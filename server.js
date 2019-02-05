const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const fs = require('fs');
fs.readFile('./primes10000.txt', 'utf8', function(err,data) {
    if(err) throw err;
    let obj = {};
    let splitted = data.toString().split("\n");
    for (let i = 0; i<splitted.length-2; i++) {
       let splitline = splitted[i].split(':')
        obj[splitline[0]] = splitline[1].split(' ',11).slice(1);
    }
    console.log(obj);
});

app.listen(port, () => console.log(`Listening on port ${port}`));