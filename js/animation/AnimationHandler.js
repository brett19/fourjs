var AnimationHandler = {};

var _activeAnimations = [];

AnimationHandler.play = function(anim) {
  _activeAnimations.push(anim);
  return true;
};

AnimationHandler.stop = function(anim) {
  var animIdx = _activeAnimations.indexOf(anim);
  if (animIdx !== -1) {
    _activeAnimations.splice(animIdx, 1);
    return true;
  }
  return false;
};

AnimationHandler.update = function(delta) {
  // TODO: Maybe find a cheaper way to ensure no breakage when changing active animations during recursion.
  var anims = _activeAnimations;
  for (var i = 0, l = anims.length; i < l; ++i) {
    anims[i].preUpdate(delta);
  }
  for (var i = 0, l = anims.length; i < l; ++i) {
    anims[i].update(delta);
  }
};
