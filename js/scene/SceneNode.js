(function(FOUR) {

  function SceneNode() {
    this.name = '';

    this.parent = null;
    this.children = [];
    this.visible = true;

    this.position = vec3.create();
    this.rotation = quat.create();
    this.scale = vec3.fromValues(1, 1, 1);

    this.matrix = mat4.create();
    this.matrixWorld = mat4.create();

    this._animCache = null;
  }

  SceneNode.prototype.localToWorld = function(out, pos) {
    vec3.transformMat4(out, pos, this.matrixWorld);
  };

  SceneNode.prototype.worldToLocal = (function() {
    var _tmpMat = mat4.create();
    return function(out, pos) {
      mat4.invert(_tmpMat, this.matrixWorld);
      vec3.transformMat4(out, pos, _tmpMat)
    };
  })();

  SceneNode.prototype.updateMatrix = function (noUpdateWorldMatrix) {
    mat4.fromRotationTranslation(this.matrix, this.rotation, this.position);
    mat4.scale(this.matrix, this.matrix, this.scale);
    if (!noUpdateWorldMatrix) {
      this.updateMatrixWorld();
    }
  };

  SceneNode.prototype.updateMatrixWorld = function() {
    if (this.parent) {
      mat4.multiply(this.matrixWorld, this.parent.matrixWorld, this.matrix);
    } else {
      mat4.copy(this.matrixWorld, this.matrix);
    }

    var children = this.children;
    for (var i = 0, l = children.length; i < l; ++i) {
      children[i].updateMatrixWorld();
    }
  };

  SceneNode.prototype.add = function(child) {
    if (child.parent) {
      child.parent.remove(child);
    }
    this.children.push(child);
    child.parent = this;
    child.updateMatrixWorld();
  };

  SceneNode.prototype.remove = function(child) {
    var childIdx = this.children.indexOf(child);
    if (childIdx !== -1) {
      this.children.splice(childIdx, 1);
      child.parent = null;
      return true;
    }
    return false;
  };

  FOUR.SceneNode = SceneNode;

})(FOUR);
