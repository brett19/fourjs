function Camera() {
  SceneNode.call(this);

  this.matrixWorldInverse = mat4.create();
  this.projMatrix = mat4.create();
  this.screenMatrix = mat4.create();
}
Camera.prototype = Object.create(SceneNode.prototype);

Camera.prototype.updateScreenMatrix = function() {
  mat4.multiply(this.screenMatrix, this.projMatrix, this.matrixWorldInverse);
};

Camera.prototype.setPerspective = function(fovY, aspect, near, far) {
  mat4.perspective(this.projMatrix, fovY, aspect, near, far);
  this.updateScreenMatrix();
};

Camera.prototype.updateMatrixWorld = function() {
  SceneNode.prototype.updateMatrixWorld.call(this);

  mat4.invert(this.matrixWorldInverse, this.matrixWorld);
  this.updateScreenMatrix();
};