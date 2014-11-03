(function(FOUR) {

  function SimpleScene() {
    this.name = '';

    this.parent = null;
    this.children = [];

    this.matrixWorld = mat4.create();
  }

  SimpleScene.prototype.add = function(child) {
    if (child.parent) {
      child.parent.remove(child);
    }
    this.children.push(child);
    child.parent = this;
    child.updateMatrixWorld();
  };

  SimpleScene.prototype.remove = function(child) {
    var childIdx = this.children.indexOf(child);
    if (childIdx !== -1) {
      this.children.splice(childIdx, 1);
      child.parent = null;
      return true;
    }
    return false;
  };

  SimpleScene.prototype._foreachInFrustum = function(obj, frustum, callback) {
    var children = obj.children;
    for (var i = 0, l = children.length; i < l; ++i) {
      var child = children[i];
      callback(child);
      this._foreachInFrustum(child, frustum, callback);
    }
  };

  SimpleScene.prototype.foreachInFrustum = function(frustum, callback) {
    this._foreachInFrustum(this, frustum, callback);
  };

  FOUR.SimpleScene = SimpleScene;

})(FOUR);
