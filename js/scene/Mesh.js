(function(FOUR) {
  var SceneNode = FOUR.SceneNode;

  function Mesh(geometry, material) {
    SceneNode.call(this);

    this.geometry = geometry;
    this.material = material;
  }
  Mesh.prototype = Object.create(SceneNode.prototype);

  FOUR.Mesh = Mesh;

})(FOUR);
