function Animator(object, animationData) {
  EventEmitter.call(this);

  this.objects = object;
  this.data = animationData;
  this.currentTime = 0;
  this.isPlaying = false;
  this.isPaused = false;
  this.loop = 0;
  this.timeScale = 1;
  this.length = this.data.frameCount / this.data.fps;
}

Animator.prototype = Object.create(EventEmitter.prototype);

Animator.prototype.play = function (startTime, weight) {
  if (this.isPlaying) {
    this.stop();
  }

  this.currentTime = startTime !== undefined ? startTime : 0;
  this.weight = weight !== undefined ? weight : 1;

  this.reset();

  this.isPlaying = true;

  AnimationHandler.play(this);
};

Animator.prototype.pause = function() {
  this.isPaused = true;
};

Animator.prototype.unpause = function() {
  this.isPaused = false;
};

Animator.prototype.stop = function () {
  if (!this.isPlaying) {
    return;
  }

  this.isPlaying = false;
  this.isPaused = false;

  AnimationHandler.stop(this);
};

Animator.prototype.reset = function () {
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

Animator.prototype._applyChannel = function(index, type, value) {
  var object = this.objects[index];
  if (type === RAnimationData.CHANNEL_TYPE.Position) {
    vec3.copy(object.position, value);
  } else if (type === RAnimationData.CHANNEL_TYPE.Rotation) {
    quat.copy(object.rotation, value);
  } else if (type === RAnimationData.CHANNEL_TYPE.Scale) {
    vec3.copy(object.scale, value);
  }
};

Animator.prototype._applyChannels = (function() {
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

Animator.prototype.preUpdate = function () {
  for (var h = 0, hl = this.objects.length; h < hl; h++) {
    var object = this.objects[h];

    if (object.animatorCache !== undefined) {
      object.animatorCache.blending.positionWeight = 0.0;
      object.animatorCache.blending.quaternionWeight = 0.0;
      object.animatorCache.blending.scaleWeight = 0.0;
    }
  }
};

Animator.prototype.update = function (delta) {
  if (this.isPlaying === false) return delta;

  if (!this.isPaused) {
    this.currentTime += delta * this.timeScale;

    // If this is the last frame, we have to stop at the last frame, rather
    //   then blending back towards frame 0, remove that time.
    var endTime = this.length;
    if (this.loop === 1) {
      endTime = (this.data.frameCount - 1) / this.data.fps;
    }

    if (this.currentTime >= endTime || this.currentTime < 0) {
      if (this.loop === 0 || this.loop > 1) {
        if (this.loop !== 0) {
          this.loop--;
        }

        this.currentTime %= this.length;

        if (this.currentTime < 0) {
          this.currentTime += this.length;
        }

        this.reset();
        this.emit('restart');
      } else {
        var timeConsumed = endTime - this.currentTime;
        this.currentTime = endTime;
        this.pause();
        this.emit('finish');
        return delta - timeConsumed;
      }
    }
  }

  if (this.weight === 0) {
    return 0.0;
  }

  var thisFrame = Math.floor(this.currentTime * this.data.fps);
  // TODO: THIS SHOULD NOT BE NEEDED
  if (thisFrame >= this.data.frameCount) {
    thisFrame = this.data.frameCount - 1;
  }
  var nextFrame = thisFrame + 1;
  if (nextFrame >= this.data.frameCount) {
    if (this.loop) {
      nextFrame -= this.data.frameCount;
    } else {
      nextFrame = thisFrame;
    }
  }

  var frameRatio = ( this.currentTime - (thisFrame / this.data.fps) ) / (1 / this.data.fps);
  this._applyChannels(this.data.channels, thisFrame, nextFrame, frameRatio);

  // We assume all objects are parents of object[0].
  var objects = this.objects;
  for (var h = 1, hl = objects.length; h < hl; h++) {
    objects[h].updateMatrix(true);
  }
  objects[0].updateMatrix();

  return 0.0;
};
