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
