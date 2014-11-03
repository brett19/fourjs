(function(FOUR) {
  var SceneNode = FOUR.SceneNode;

  function SkeletonHelper(skeleton) {
    SceneNode.call(this);
    this.skeleton = skeleton;
  }
  SkeletonHelper.prototype = Object.create(SceneNode.prototype);

  FOUR.SkeletonHelper = SkeletonHelper;

})(FOUR);
