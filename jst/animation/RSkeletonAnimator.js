function RSkeletonAnimator(skeleton, animationData) {
  RAnimator.call(this, skeleton.bones, animationData);
}
RSkeletonAnimator.prototype = Object.create(RAnimator.prototype);
