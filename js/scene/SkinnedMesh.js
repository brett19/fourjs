(function(FOUR) {
  var SceneNode = FOUR.SceneNode;

  function SkinnedMesh(geometry, material, skeleton) {
    SceneNode.call(this);

    this.geometry = geometry;
    this.material = material;
    this.skeleton = skeleton;
  }
  SkinnedMesh.prototype = Object.create(SceneNode.prototype);

  FOUR.SkinnedMesh = SkinnedMesh;

})(FOUR);
