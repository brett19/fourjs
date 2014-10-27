function GeometryData(data, stride) {
  this.data = data;
  this.stride = stride || 0;
  this._glData = null;
}

function GeometryAttribute(buffer, itemSize, offset) {
  this.buffer = buffer;
  this.itemSize = itemSize;
  this.offset = offset;
}

function Geometry() {
  this.boundingSphere = bsphere.create();

  this.attributes = {};
}

Geometry.prototype.addAttribute = function(name, buffer, itemSize, offset) {
  var offset_ = offset || 0;
  this.attributes[name] = new GeometryAttribute(buffer, itemSize, offset_);
};