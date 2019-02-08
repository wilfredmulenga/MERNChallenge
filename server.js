const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;


app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers')
res.setHeader('Cache-Control', 'no-cache');
 next();
})


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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var pmSchema = new mongoose.Schema({
    key: [String]
  });
  var searchResultsSchema = new mongoose.Schema(
    {input: String,
    primeNumber : String,
    },
    {timestamps: true}
  );
  var primeNumbers = mongoose.model('primeNumbers', pmSchema);  
  var searchResults = mongoose.model('searchResults', searchResultsSchema);  
//    app.get('/',(req,res)=>{
//     primeNumbers.find({}, function(err, data){
//    if(err)
//     console.log(err)
//     res.json({datatype: typeof data,data:data})
// })
//    })
app.get('/searchResults',(req,res)=>{
  searchResults.find({}).sort({createdAt:'descending'}).exec(function(err,data){
      if(err)
      res.send(err)
      res.send({data:data})
      //console.log(data)
  })
})
   app.get('/search',(req,res)=>{
      let input = req.query.input;
      let regexp = new RegExp(`${input}`)
      primeNumbers.aggregate([
        {"$match":{ "key" : { $regex: regexp } }},
         {"$unwind":"$key"},
         {"$match":{ "key" : { $regex: regexp } }}
      ],
     
      function (err, data) {
        if (err) 
        console.log(err)
        res.json({length:data.length ,data:data[0].key})

})
   })

   app.post('/addToSearchResults',(req,res)=>{
    let input = req.body.input
    let primeNumber = req.body.primeNumber
    let doc =  {'input':input,'primeNumber':primeNumber}
    searchResults.create(doc,function(err,data){
      if(err)
      res.send(err)
      res.send(data)
    })
  })

 

// fs.readFile('./primes10000.txt', 'utf8', function(err,data) {
//     if(err) throw err;
//     let obj = [];
//     let splitted = data.toString().split("\n");
//     for (let i = 0; i<splitted.length-2; i++) {
//        let splitline = splitted[i].split(':')
//         obj.push({ "key" : splitline[1].split(' ',11).slice(1)});
//     }
//     console.log(obj);
//     //insert prime numbers into collection
//     primeNumbers.collection.insertMany(obj)
// });

   //primeNumbers is the collection
//    primeNumbers.find(function (err, pm) {
//     if (err) return console.error(err);
//     console.log(pm);
//   })

app.listen(port, () => console.log(`Listening on port ${port}`));