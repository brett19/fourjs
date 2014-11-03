var RoseLoader = {};

var ROSE_DATA_PATH = '/rosedata/';

RoseLoader.load = function(path, callback) {
  FOUR.io.loadRaw(ROSE_DATA_PATH + path, function(err, res) {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, new FOUR.BinaryReader(res));
  })
};
