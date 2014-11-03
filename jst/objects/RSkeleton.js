function RSkeleton(skeletonData) {
  FOUR.Skeleton.call(this);

  var boneObjs = [];
  var bones = skeletonData.bones;
  for (var i = 0; i < bones.length; ++i) {
    var bone = bones[i];

    var boneObj = new FOUR.SkeletonBone();
    vec3.copy(boneObj.position, bone.position);
    quat.copy(boneObj.rotation, bone.rotation);
    boneObj.updateMatrix(true);

    if (i > 0) {
      boneObjs[bone.parent].add(boneObj);
    } else {
      this.add(boneObj);
    }

    boneObjs.push(boneObj);
  }
  this.bones = boneObjs;
  this.updateMatrixWorld();
  this.setBindPose();
}
RSkeleton.prototype = Object.create(FOUR.Skeleton.prototype);
