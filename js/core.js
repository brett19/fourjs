var FOUR = {};

FOUR.defaultUp = vec3.fromValues(0, 0, 1);

FOUR.frame = function(frameFunc) {
  var prevTime = 0;
  function renderFrame() {
    requestAnimationFrame(renderFrame, null);
    var time = performance.now();
    var dTime = 0;
    if (prevTime > 0) {
      dTime = (time - prevTime) / 1000;
    }
    prevTime = time;
    frameFunc(dTime);
  }
  renderFrame();
};
