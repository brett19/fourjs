(function(FOUR) {
  var SceneNode = FOUR.SceneNode;

  function Skeleton() {
    SceneNode.call(this);

    this.boneMatrix = mat4.create();
    this.boneBaseMatrix = mat4.create();
    this.bones = [];

    this._glData = null;
  }
  Skeleton.prototype = Object.create(SceneNode.prototype);

  Skeleton.prototype.updateMatrixWorld = function() {
    SceneNode.prototype.updateMatrixWorld.call(this);

    mat4.invert(this.boneBaseMatrix, this.matrixWorld);
  };

  Skeleton.prototype.setBindPose = function() {
    var bones = this.bones;
    for (var i = 0, l = bones.length; i < l; ++i) {
      var bone = bones[i];
      mat4.multiply(bone.bindMatrix, this.boneBaseMatrix, bone.matrixWorld);
      mat4.invert(bone.bindMatrix, bone.bindMatrix);
    }
  };

  function SkeletonBone() {
    SceneNode.call(this);

    this.bindMatrix = mat4.create();
    this.boneMatrix = mat4.create();
  }
  SkeletonBone.prototype = Object.create(SceneNode.prototype);

  SkeletonBone.prototype.updateMatrixWorld = function() {
    SceneNode.prototype.updateMatrixWorld.call(this);

    mat4.multiply(this.boneMatrix, this.matrixWorld, this.bindMatrix);
  };

  FOUR.Skeleton = Skeleton;
  FOUR.SkeletonBone = SkeletonBone;

})(FOUR);