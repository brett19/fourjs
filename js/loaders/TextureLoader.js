(function(FOUR) {
  var Texture = FOUR.Texture;

  var TextureLoader = {};

  TextureLoader._detectors = [];

  TextureLoader.load = function(path, callback) {
    var tex = new Texture();

    var detectors = TextureLoader._detectors;
    var thisDetector = null;
    for (var i = detectors.length-1; i >= 0; --i) {
      var detector = detectors[i];
      if (detector.detect(path)) {
        detector.load(tex, path, callback);
        thisDetector = detector;
        break;
      }
    }
    if (!thisDetector) {
      callback(new Error('Unable to find loader for:', path), null);
      return;
    }
    return tex;
  };

  TextureLoader.registerLoader = function(detectObj) {
    TextureLoader._detectors.push(detectObj);
  };

  FOUR.TextureLoader = TextureLoader;

})(FOUR);
