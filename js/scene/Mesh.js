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



function SkinnedMesh(geometry, material, skeleton) {
  SceneNode.call(this);

  this.geometry = geometry;
  this.material = material;
  this.skeleton = skeleton;
}
SkinnedMesh.prototype = Object.create(SceneNode.prototype);
