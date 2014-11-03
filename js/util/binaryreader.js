(function(FOUR) {

  function BinaryReader(arrayBuffer) {
    this.buffer = new Uint8Array(arrayBuffer);
    this.view = new DataView(arrayBuffer);
    this.pos = 0;
  };

  BinaryReader.prototype.tell = function() {
    return this.pos;
  };

  BinaryReader.prototype.seek = function(pos) {
    if (pos >= 0) {
      this.pos = pos;
    } else {
      this.pos = this.buffer.byteLength + pos;
    }
  };

  BinaryReader.prototype.skip = function(num) {
    this.pos += num;
  };

  BinaryReader.prototype.readFloat = function() {
    var res = this.view.getFloat32(this.pos, true);
    this.pos += 4;
    return res;
  };

  BinaryReader.prototype.readUint8 = function() {
    return this.buffer[this.pos++];
  };

  BinaryReader.prototype.readUint16 = function() {
    var res = this.buffer[this.pos+1] << 8 |
        this.buffer[this.pos+0];
    this.pos += 2;
    return res;
  };

  BinaryReader.prototype.readUint32 = function() {
    var res = (this.buffer[this.pos+3] << 24 |
        this.buffer[this.pos+2] << 16 |
        this.buffer[this.pos+1] << 8 |
        this.buffer[this.pos+0]) >>> 0;
    this.pos += 4;
    return res;
  };

  BinaryReader.prototype.readUintVar = function() {
    var chr = this.readUint8();
    var res = chr & 0x7f;
    var shift = 7;
    while (chr & 0x80) {
      chr = this.readUint8();
      res |= (chr & 0x7f) << shift;
      shift += 7;
    }
    return res;
  };

  BinaryReader.prototype.readInt8 = function() {
    var res = this.view.getInt8(this.pos);
    this.pos += 1;
    return res;
  };

  BinaryReader.prototype.readInt16 = function() {
    var res = this.view.getInt16(this.pos, true);
    this.pos += 2;
    return res;
  };

  BinaryReader.prototype.readInt32 = function() {
    var res = this.view.getInt32(this.pos, true);
    this.pos += 4;
    return res;
  };

  BinaryReader.prototype._readString = function() {
    var startPos = this.pos;
    while (this.buffer[this.pos++]);
    var strArray = this.buffer.subarray(startPos, this.pos - 1);
    return String.fromCharCode.apply(null, strArray);
  };

  BinaryReader.prototype._readStringWithLen = function(len) {
    var realStrLen;
    for (realStrLen = 0; realStrLen < len; realStrLen++) {
      if (this.buffer[this.pos+realStrLen] === 0) break;
    }
    var strArray = this.buffer.subarray(this.pos, this.pos + realStrLen);
    this.pos += len;
    return String.fromCharCode.apply(null, strArray);
  };

  BinaryReader.prototype.readString = function(len) {
    if (len) {
      return this._readStringWithLen(len);
    } else {
      return this._readString();
    }
  }

  BinaryReader.prototype.readUint8Str = function() {
    return this._readStringWithLen(this.readUint8());
  };

  BinaryReader.prototype.readUint16Str = function() {
    return this._readStringWithLen(this.readUint16());
  };

  BinaryReader.prototype.readUint32Str = function() {
    return this._readStringWithLen(this.readUint32());
  };

  BinaryReader.prototype.readUintVarStr = function() {
    return this._readStringWithLen(this.readUintVar());
  };

  BinaryReader.prototype.readUint8Array = function(len) {
    var array = new Uint8Array(this.buffer.buffer, this.pos, len);
    this.pos += len;
    return array;
  };

  BinaryReader.prototype.readUint16Array = function(len) {
    if ((this.pos % 2) === 0) {
      var array = new Uint16Array(this.buffer.buffer, this.pos, len);
      this.pos += len * 2;
      return array;
    } else {
      var buffer = new Uint8Array(this.readUint8Array(len * 2));
      return new Uint16Array(buffer.buffer, 0, len);
    }
  };

  BinaryReader.prototype.readUint32Array = function(len) {
    if ((this.pos % 4) === 0) {
      var array = new Uint32Array(this.buffer.buffer, this.pos, len);
      this.pos += len * 4;
      return array;
    } else {
      var buffer = new Uint8Array(this.readUint8Array(len * 4));
      return new Uint32Array(buffer.buffer, 0, len);
    }
  };

  BinaryReader.prototype.readFloatArray = function(len) {
    if ((this.pos % 4) === 0) {
      var array = new Float32Array(this.buffer.buffer, this.pos, len);
      this.pos += len * 4;
      return array;
    } else {
      var buffer = new Uint8Array(this.readUint8Array(len * 4));
      return new Float32Array(buffer.buffer, 0, len);
    }
  };

  BinaryReader.prototype.readVector2 = function() {
    var x = this.readFloat();
    var y = this.readFloat();
    return vec2.fromValues(x, y);
  };

  BinaryReader.prototype.readVector3 = function() {
    var x = this.readFloat();
    var y = this.readFloat();
    var z = this.readFloat();
    return vec3.fromValues(x, y, z);
  };

  BinaryReader.prototype.readQuat = function() {
    var x = this.readFloat();
    var y = this.readFloat();
    var z = this.readFloat();
    var w = this.readFloat();
    return quat.fromValues(x, y, z, w);
  };

  BinaryReader.prototype.readColour3 = function() {
    var r = this.readFloat();
    var g = this.readFloat();
    var b = this.readFloat();
    return vec3.fromValues(r, g, b);
  };

  BinaryReader.prototype.readColor4 = function() {
    var r = this.readFloat();
    var g = this.readFloat();
    var b = this.readFloat();
    var a = this.readFloat();
    return vec4.fromValues(r, g, b, a);
  };

  /* SPECIAL ONES */

  BinaryReader.prototype.readUint24 = function() {
    var res = this.buffer[this.pos+2] << 16 |
        this.buffer[this.pos+1] << 8 |
        this.buffer[this.pos+0];
    this.pos += 3;
    return res;
  };

  BinaryReader.prototype.readVector3xzy = function() {
    var x = this.readFloat();
    var z = this.readFloat();
    var y = this.readFloat();
    return vec3.fromValues(x, y, z);
  };

  BinaryReader.prototype.readQuatwxyz = function() {
    var w = this.readFloat();
    var x = this.readFloat();
    var y = this.readFloat();
    var z = this.readFloat();
    return quat.fromValues(x, y, z, w);
  };

  FOUR.BinaryReader = BinaryReader;

})(FOUR);
