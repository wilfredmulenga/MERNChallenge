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
mongoose.connect('mongodb://localhost/test',{ useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
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

//retrieve array of prime numbers and push them to "obj"
fs.readFile('./primes10000.txt', 'utf8', function(err,data) {
  if(err) throw err;
  let obj = [];
  let splitted = data.toString().split("\n");
  for (let i = 0; i<splitted.length-2; i++) {
     let splitline = splitted[i].split(':')
      obj.push({ "key" : splitline[1].split(' ',11).slice(1)});
  }
  
  //if primenumbers collection is empty, insert "obj"
  primeNumbers.countDocuments({},function(err,data){
    if(err)
    console.log(err)
    if(data===0){
      primeNumbers.collection.insertMany(obj)
      console.log(data)
    }
  })
});

//get list of search results from searchresults collection
app.get('/searchResults',(req,res)=>{
  searchResults.find({}).sort({createdAt:'descending'}).exec(function(err,data){
      if(err)
      res.send(err)
      res.send({data:data})
  })
})

//look for matching prime numbers, and outputs a document with only matched prime numbers
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
        //get the first document
        res.json({length:data.length ,data:data[0].key})

})
   })

   //add input data and search result to searchresults collection
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

app.listen(port, () => console.log(`Listening on port ${port}`));