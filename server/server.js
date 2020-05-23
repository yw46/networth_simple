var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var items = [
  {
    id: 1,
    type: "assets",
    term: "short",
    title: "cheqing",
    amount: 2000.00,
    currency: "CAD",
    status: "current"
  },
  {
    id: 2,
    type: "liabilities",
    term: "long",
    title: "debts",
    amount: 2000.00,
    currency: "CAD",
    status: "current"
  }
];

app.get('/', function(req, res) {
  console.log('get request -> /');
  res.status(200).send(items);
});

app.get('/items', function(req, res) {
  console.log('get request -> /items');
  res.status(200).send(items);
});

app.post('/items', function(req, res) {
  console.log('post request -> /items');
  var item = req.body;
  var itemId = parseInt(item.id);
  var objectFound = false;
  
  console.log('amount' + item.amount);
  
  for (var i = 0; i < items.length; i++) {
    if (itemId === items[i].id) {
      objectFound = true;
      console.log('object found');
      items[i] = item;
      break;
    }
  }
  
  if (!objectFound) {
    items.push(item);
  }
  
  res.status(200).send(item);
});

app.get('/items/:itemId', function(req, res) {
  var itemId = parseInt(req.params.itemId);
  var objectFound = false;

  var item;

  for (var i = 0; i < items.length; i++) {
    item = items[i];
    if (item.id === itemId) {
      objectFound = true;
      break;
    }
  }

  if (objectFound) {
    res.status(200).send(item);
  } else {
    res.status(500).send({error: "Item not found"});
  }
});

app.listen(3000, function() {
  console.log('API running on port 3000');
});