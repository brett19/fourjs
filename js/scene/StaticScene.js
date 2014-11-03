(function(FOUR) {

  function StaticSceneNode(bounds) {
    this.bounds = bounds;
    this.children = null;
    this.contents = [];
  }

  StaticSceneNode.prototype.branch = function() {
    this.children = [
      new StaticSceneNode(),
      new StaticSceneNode(),
      new StaticSceneNode(),
      new StaticSceneNode()
    ];
  };

  StaticSceneNode.prototype.traverse = function(callback) {
    var contents = this.contents;
    for (var i = 0, l = contents.length; i < l; ++i) {
      callback(contents[i]);
    }

    if (this.children) {
      this.children[0].traverse(callback);
      this.children[1].traverse(callback);
      this.children[2].traverse(callback);
      this.children[3].traverse(callback);
    }
  };

  function StaticScene(bounds) {
    this.quadRoot = new StaticSceneNode(bounds);
  };

  StaticScene.prototype.traverse = function(callback) {
    this.quadRoot.traverse(callback);
  };

  FOUR.StaticScene = StaticScene;

})(FOUR);
