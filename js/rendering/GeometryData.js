(function(FOUR) {

  function GeometryData(data, stride, format) {
    this.data = data;
    this.stride = stride || 0;
    this.format = format;
    this._glData = null;
  }

  GeometryData.Format = {
    Invalid: -1,
    UnsignedByte: 0,
    UnsignedShort: 1,
    UnsignedInt: 2
  };

  GeometryData.prototype._calcDataFormat = function() {
    if (this.data instanceof Uint8Array) {
      return GeometryData.Format.UnsignedByte;
    } else if (this.data instanceof Uint16Array) {
      return GeometryData.Format.UnsignedShort;
    } else if (this.data instanceof Uint32Array) {
      return GeometryData.Format.UnsignedInt;
    }
    return GeometryData.Format.Invalid;
  };

  FOUR.GeometryData = GeometryData;

})(FOUR);