var hashStream = require('hashstream');


var checkHashes = function (hashes, callback) {

  var isEqual    = true;
  var hashSample = hashes[0];
  
  for (var i = 1; (i < hashes.length) && isEqual; i++) {
    if (hashSample !== hashes[i]) isEqual = false;
  }
  if (isEqual) callback(null, true); else callback(null, false);
}

module.exports = equalStreams;
function equalStreams() {
  var streams  = Array.prototype.slice.call(arguments);
  var callback = streams.pop(); // Last item of args

  if (streams.length === 1 && streams[0] instanceof Array)
    streams = streams[0];

  if (typeof callback !== 'function') {
    throw new Error("Must give a callback");
  } else if (streams.length < 2){
    callback(new Error("must give 2 or more streams"), null);
    return;
  }

  var hashes  = [];
  var lock    = 0;
  var lockCap = streams.length;

  var hashCallback = function(err, hash) {
    if (err) return callback(err);
    hashes.push(hash);
    ++lock;
    if (lock === lockCap) checkHashes(hashes, callback);
  }

  streams.forEach(function(stream, index) {
    hashStream(stream, hashCallback);
  });
}

