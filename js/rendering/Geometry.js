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

function GeometryAttribute(buffer, itemSize, offset) {
  this.buffer = buffer;
  this.itemSize = itemSize;
  this.offset = offset;
  this.needsUpdate = false;
}

function GeometryIndices(buffer, count, offset) {
  this.buffer = buffer;
  this.count = count;
  this.offset = offset;
  this.needsUpdate = false;
}

function Geometry() {
  this.boundingSphere = bsphere.create();

  this.primType = Geometry.PrimitiveType.Triangles;
  this.drawOffset = 0;
  this.drawCount = 0;
  this.indexBuffer = null;
  this.indexFormat = 0;
  this.attributes = {};
}

Geometry.PrimitiveType = {
  Triangles: 0,
  TriangleStrip: 1,
  Lines: 2
};

Geometry.prototype.addAttribute = function(name, buffer, itemSize, offset, format) {
  var buffer_ = (buffer instanceof GeometryData) ? buffer : new GeometryData(buffer);
  var offset_ = offset || 0;
  var format_ = format || buffer_._calcDataFormat();
  this.attributes[name] = new GeometryAttribute(buffer_, itemSize, offset_, format_);

  if (this.drawCount === 0) {
    this.drawCount = buffer_.data.length / itemSize / 3;
  }
};

Geometry.prototype.setDraw = function(count, offset, primType) {
  var offset_ = offset || 0;
  var primType_ = primType || Geometry.PrimitiveType.Triangles;
  this.primType = primType_;
  this.indexBuffer = null;
  this.indexFormat = 0;
  this.drawOffset = offset_;
  this.drawCount = count;
};

// TODO: Fix this to use GeometryIndices properly...
Geometry.prototype.setIndices = function(buffer, count, offset, primType, format) {
  var buffer_ = (buffer instanceof GeometryData) ? buffer : new GeometryData(buffer);
  var offset_ = offset || 0;
  var primType_ = primType || Geometry.PrimitiveType.Triangles;
  var format_ = format || buffer_._calcDataFormat();
  this.primType = primType_;
  this.indexBuffer = buffer_;
  this.indexFormat = format_;
  this.drawOffset = offset_;
  this.drawCount = count;
};
