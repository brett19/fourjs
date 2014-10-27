var aabb = {};

aabb.create = function() {
  return new Float32Array(6);
};

aabb.addPoint = function(out, p) {
  if (out[0] > p[0]) {
    out[0] = p[0];
  }
  if (out[1] > p[1]) {
    out[1] = p[1];
  }
  if (out[2] > p[2]) {
    out[2] = p[2];
  }
  if (out[3] < p[0]) {
    out[3] = p[0];
  }
  if (out[4] < p[1]) {
    out[4] = p[1];
  }
  if (out[5] < p[2]) {
    out[5] = p[2];
  }
};

var bsphere = {};

bsphere.create = function() {
  return new Float32Array(4);
};

bsphere.transformMat4 = function(out, a, m) {
  vec3.transformMat4(out, a, m);
  // TODO: Account for scaling
};

var FOUR = {};
