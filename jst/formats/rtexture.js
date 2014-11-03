var RTexture = {};

RTexture.load = function(path, callback) {
  return FOUR.TextureLoader.load(ROSE_DATA_PATH + path, callback);
};