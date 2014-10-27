function Mesh(geometry, material) {
  SceneNode.call(this);

  this.geometry = geometry;
  this.material = material;

  this.worldBoundingSphere = bsphere.create();
}
Mesh.prototype = Object.create(SceneNode.prototype);

Mesh.prototype.updateMatrix = function() {
  SceneNode.prototype.updateMatrix.call(this);

  bsphere.transformMat4(
      this.worldBoundingSphere,
      this.geometry.boundingSphere,
      this.matrixWorld);
};