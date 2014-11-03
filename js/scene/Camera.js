(function(FOUR) {
  var SceneNode = FOUR.SceneNode;

  function Camera() {
    SceneNode.call(this);

    this.matrixWorldInverse = mat4.create();
    this.projMatrix = mat4.create();
    this.screenMatrix = mat4.create();
    this.lookMatrix = mat4.create();
  }

  Camera.prototype = Object.create(SceneNode.prototype);

  Camera.prototype.lookAt = (function () {
    // TODO: Figure out why this function has to be so complicated...
    var _tmpVec3 = vec3.create();
    var _tmpMat4 = mat4.create();
    var _tmpMat3 = mat3.create();
    return function (vec, up) {
      var up_ = up || FOUR.defaultUp;
      vec3.negate(_tmpVec3, up_);
      mat4.lookAt(_tmpMat4, this.position, vec, _tmpVec3);
      mat3.fromMat4(_tmpMat3, _tmpMat4);
      quat.fromMat3(this.rotation, _tmpMat3);
      quat.normalize(this.rotation, this.rotation);
      quat.invert(this.rotation, this.rotation);
      this.updateMatrix();
    };
  })();

  Camera.prototype.updateScreenMatrix = function () {
    mat4.multiply(this.screenMatrix, this.projMatrix, this.matrixWorldInverse);
  };

  Camera.prototype.setPerspective = function (fovY, aspect, near, far) {
    mat4.perspective(this.projMatrix, fovY, aspect, near, far);
    this.updateScreenMatrix();
  };

  Camera.prototype.updateMatrixWorld = function () {
    SceneNode.prototype.updateMatrixWorld.call(this);

    mat4.invert(this.matrixWorldInverse, this.matrixWorld);
    this.updateScreenMatrix();
  };

  FOUR.Camera = Camera;

})(FOUR);