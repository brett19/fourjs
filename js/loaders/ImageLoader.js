(function(FOUR) {
  var TextureLoader = FOUR.TextureLoader;

  var IMAGEEXTS = ['png', 'bmp', 'jpg', 'jpeg'];

  var ImageLoader = {};

  ImageLoader.detect = function(path) {
    var pathExt = path.substr(-3).toLowerCase();
    return IMAGEEXTS.indexOf(pathExt) !== -1;
  };

  ImageLoader.load = function(tex, path, callback) {
    var image = document.createElement('img');
    image.crossOrigin = 'anonymous';
    image.addEventListener('load', function() {
      tex.data = image;
      tex.needsUpdate = true;
      if (callback) {
        callback(null, true);
      }
    });
    image.src = path;
  };

  TextureLoader.registerLoader(ImageLoader);

})(FOUR);