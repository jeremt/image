var fs = require('fs')
  , image = require('./lib/image')
  , express = require('express')

// Init express.

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

// Load image localy

app.get('/', function (req, res) {
  fs.readFile(__dirname + '/imgs/example.png', function (err, data) {
    if (err) throw err;
    res.render("index", {
      binaryData: image.toDataURL(data)
    });
  });
});

// Load image from the web

app.get('/web', function (req, res) {
  var url = 'http://img830.imageshack.us/img830/2689/defaultdesktop.jpg';
  image.load(url, function (data) {
    res.render("index", {
      binaryData: image.toDataURL(data)
    });
  });
});

app.listen(4242);