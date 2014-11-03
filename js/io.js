(function(FOUR) {

  var io = {};

  io.load = function(path, asBinary, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', path, true);
    if (callback) {
      request.addEventListener('load', function () {
        callback(null, this.response);
      });
      request.addEventListener('error', function (e) {
        callback(e, null);
      });
    }
    request.responseType = asBinary ? 'arraybuffer' : 'text';
    request.send(null);
  };

  io.loadRaw = function(path, callback) {
    return io.load(path, true, callback);
  };

  io.loadString = function(path, callback) {
    return io.load(path, false, callback);
  };

  FOUR.io = io;

})(FOUR);
