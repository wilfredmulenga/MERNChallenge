const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const fs = require('fs');
var mongoose = require('mongoose');
var assert = require('assert')
mongoose.connect('mongodb://localhost/test',{ useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('connected')
});
var pmSchema = new mongoose.Schema({
    key: [String]
  });
  var primeNumbers = mongoose.model('primeNumbers', pmSchema);
  
 
fs.readFile('./primes10000.txt', 'utf8', function(err,data) {
    if(err) throw err;
    let obj = [];
    let splitted = data.toString().split("\n");
    for (let i = 0; i<splitted.length-2; i++) {
       let splitline = splitted[i].split(':')
        obj.push({[splitline[0]] : splitline[1].split(' ',11).slice(1)});
    }
    //console.log(obj);
    //insert prime numbers into collection
    primeNumbers.collection.insertMany(obj)
});

   //primeNumbers is the collection
   primeNumbers.find(function (err, pm) {
    if (err) return console.error(err);
    console.log(pm);
  })

app.listen(port, () => console.log(`Listening on port ${port}`));