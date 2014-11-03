(function(FOUR) {
  var SceneNode = FOUR.SceneNode;

  function AxisHelper(scale) {
    SceneNode.call(this);

    vec3.set(this.scale, scale, scale, scale);
    this.updateMatrix();
  }
  AxisHelper.prototype = Object.create(SceneNode.prototype);

  FOUR.AxisHelper = AxisHelper;

})(FOUR);
