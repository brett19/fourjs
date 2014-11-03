function RAnimator(objects, animationData) {
  FOUR.Animatable.call(this);

  this.objects = objects;
  this.data = animationData;
  this.frameCount = this.data.frameCount;
  this.framesPerSecond = this.data.fps;
}
RAnimator.prototype = Object.create(FOUR.Animatable.prototype);

RAnimator.prototype._applyChannel = function(index, type, value) {
  var object = this.objects[index];
  if (type === RAnimationData.CHANNEL_TYPE.Position) {
    vec3.copy(object.position, value);
  } else if (type === RAnimationData.CHANNEL_TYPE.Rotation) {
    quat.copy(object.rotation, value);
  } else if (type === RAnimationData.CHANNEL_TYPE.Scale) {
    vec3.copy(object.scale, value);
  }
};

RAnimator.prototype._applyChannels = (function() {
  var _thisData = new Array(4);
  var _nextData = new Array(4);
  var _blendData = new Array(4);
  return function _applyChannels(channels, thisFrame, nextFrame, frameRatio) {
    var invFrameRatio = 1 - frameRatio;
    for (var i = 0; i < channels.length; ++i) {
      var c = channels[i];
      var channelWidth = RAnimationData.ChannelWidth[c.type];

      if (channelWidth === 1) {
        _thisData[0] = c.data[thisFrame+0];
        _nextData[0] = c.data[nextFrame+0];
        _blendData[0] = _thisData[0] * invFrameRatio + _nextData[0] * frameRatio;
      } else if (channelWidth === 2) {
        _thisData[0] = c.data[thisFrame*2+0];
        _thisData[1] = c.data[thisFrame*2+1];
        _nextData[0] = c.data[nextFrame*2+0];
        _nextData[1] = c.data[nextFrame*2+1];
        vec2.lerp(_blendData, _thisData, _nextData, frameRatio);
      } else if (channelWidth === 3) {
        _thisData[0] = c.data[thisFrame*3+0];
        _thisData[1] = c.data[thisFrame*3+1];
        _thisData[2] = c.data[thisFrame*3+2];
        _nextData[0] = c.data[nextFrame*3+0];
        _nextData[1] = c.data[nextFrame*3+1];
        _nextData[2] = c.data[nextFrame*3+2];
        vec3.lerp(_blendData, _thisData, _nextData, frameRatio);
      } else if (channelWidth === 4) {
        _thisData[0] = c.data[thisFrame*4+0];
        _thisData[1] = c.data[thisFrame*4+1];
        _thisData[2] = c.data[thisFrame*4+2];
        _thisData[3] = c.data[thisFrame*4+3];
        _nextData[0] = c.data[nextFrame*4+0];
        _nextData[1] = c.data[nextFrame*4+1];
        _nextData[2] = c.data[nextFrame*4+2];
        _nextData[3] = c.data[nextFrame*4+3];
        quat.slerp(_blendData, _thisData, _nextData, frameRatio);
      }

      this._applyChannel(c.index, c.type, _blendData);
    }
  };
})();

RAnimator.prototype.reset = function () {
  for (var h = 0, hl = this.objects.length; h < hl; h++) {
    var object = this.objects[h];

    if (object.animatorCache === undefined) {
      object.animatorCache = {
        blending: {
          positionWeight: 0.0,
          quaternionWeight: 0.0,
          scaleWeight: 0.0
        }
      }
    }
  }
};

RAnimator.prototype.preUpdate = function () {
  for (var h = 0, hl = this.objects.length; h < hl; h++) {
    var object = this.objects[h];

    if (object.animatorCache !== undefined) {
      object.animatorCache.blending.positionWeight = 0.0;
      object.animatorCache.blending.quaternionWeight = 0.0;
      object.animatorCache.blending.scaleWeight = 0.0;
    }
  }
};

RAnimator.prototype.apply = function (frame0, frame1, ratio) {
  this._applyChannels(this.data.channels, frame0, frame1, ratio);

  // We assume all objects are parents of object[0].
  var objects = this.objects;
  for (var h = 1, hl = objects.length; h < hl; h++) {
    objects[h].updateMatrix(true);
  }
  objects[0].updateMatrix();

  return 0.0;
};
