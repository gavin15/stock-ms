var express = require('express');

var app = express();
var request = require('request');
var bodyParser = require('body-parser');

var Cloudant = require('cloudant');


var user = "966f1913-ff48-48a5-a5a2-f5b7998bffd6-bluemix";
var password = "d7d0589410745b64687f791d54adc98f4388087974f0b9dd37d4b9a9082dec1c";
var host = "966f1913-ff48-48a5-a5a2-f5b7998bffd6-bluemix.cloudant.com";


var cloudant = Cloudant("https://" + user + ":" + password + "@" + host);

var db = cloudant.db.use('stock-companies');

app.use(bodyParser());
app.use(bodyParser.urlencoded({"extended": true}));
app.use(bodyParser.json());

app.get("/getcompanies", function(req, res) {
     db.find({selector:{type:"company"}}, function(er, result) {
    if (er) {
      throw er;
    }
res.send(result.docs);
  });
});

app.get("/hello", function(req, res) {
res.send("Hello there!");
});

app.post("/updateshare", function(req, res) {
  // res.send(req.body.operation);
  console.log(req.body);
db.get(req.body.companySymbol, { revs_info: true }, function(err, doc) {
   if (!err) {
     console.log(doc);
     
     if(req.body.operation == "buy"){
       doc.available_shares= doc.available_shares-req.body.qty;
       doc.share_price.last_update = new Date().toISOString();
     }
     else{
     	doc.available_shares= ((doc.available_shares - 0 ) + (req.body.qty - 0));
       doc.share_price.last_update = new Date().toISOString();
     }
     db.insert(doc, doc.id, function(err, doc) {
        if(err) {
           console.log('Error inserting data\n'+err);
           return 500;
        }
        console.log('Success');
        return 200;
     });
   }
});
db.find({selector:{type:"company"}}, function(er, result) {
  if (er) {
    throw er;
  }
res.send(result.docs);
});
});

app.listen(4000);
