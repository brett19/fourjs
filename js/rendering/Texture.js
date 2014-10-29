function TextureLevel() {
  this.data = null;
  this.width = 0;
  this.height = 0;
  this.needsUpdate = false;
}

function Texture() {
  this.data = null;
  this.format = Texture.Format.RGBA;
  this.pixelFormat = Texture.PixelFormat.UnsignedByte;
  this.unpackAlignment = 4;
  this.needsUpdate = false;
  this._glData = null;
}

Texture.Format = {
  Invalid: -1,
  Alpha: 0,
  Luminance: 1,
  LuminanceAlpha: 2,
  RGB: 3,
  RGBA: 4,

  // Compressed Types >= 1000
  DXT1_RGB: 1000,
  DXT1_RGBA: 1001,
  DXT3_RGBA: 1002,
  DXT5_RGBA: 1003
};

Texture.PixelFormat = {
  Invalid: -1,
  UnsignedByte: 0,
  Float: 1,
  UnsignedShort565: 2,
  UnsignedShort4444: 3,
  UnsignedShort5551: 4
};

var TextureLoader = {};
TextureLoader.load = function(path, callback) {
  var tex = new Texture();

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

  return tex;
};
