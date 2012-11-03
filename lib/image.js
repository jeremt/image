/**
 * Module dependencies
 */

var http    = require('http')
  , url     = require('url')
  , Canvas  = require('canvas')

/**
 * Load the binary data of a image from the web
 *
 * @param [String] url of the image
 * @param [Function] callback
 */

exports.load = function (host, cb) {
  var o = url.parse(host);

  http.get({
    host: o.host,
    port: 80,
    path: o.path
  }, function (res) {
    var data = new Buffer(parseInt(res.headers['content-length'], 10))
      , pos = 0;

    res.on('data', function (chunk) {
      chunk.copy(data, pos);
      pos += chunk.length;
    });

    res.on('error', function (err) {
      cb(err);
    });

    res.on('end', function () {
      cb(data);
    });

  });
};

/**
 * Draw the image into a canvas element
 * @private
 *
 * @param [Buffer] binary image buffer
 * @return [Canvas] canvas instance
 */

var _draw = function (data) {
  this.img = new Canvas.Image;
  this.img.src = data;

  this.canvas = new Canvas(this.img.width, this.img.height);
  this.ctx = this.canvas.getContext('2d');
  this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);
  return this;
};

/**
 * Take a binary image buffer and return a base64 encoded url
 *
 * @param [Buffer] binary image buffer
 * @return [String] base64 encoded url
 */

exports.toDataURL = function (data) {
  return _draw(data).canvas.toDataURL();
};

/**
 * Take a binary image buffer and return an array of pixels
 *
 * @param [Buffer] binary image buffer
 * @return [Array] 1 dimention array of pixels formated like [r, g, b]
 */

exports.toPixelArray = function (data, precision) {
  if (precision===undefined) precision = 5;

  var d = _draw(data)
    , arr = []
    , data = d.ctx.getImageData(0, 0, d.img.width, d.img.height).data
    , l = data.length
    , i = 0

  while (i < l) {
    arr.push([data[i], data[i + 1], data[i + 2]]);
    i += precision * 4;
  }
  return arr;
};