(function(FOUR) {

  function Animatable() {
    EventEmitter.call(this);

    this.time = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.loop = 0;
    this.timeScale = 1;
    this.frameCount = 0;
    this.framesPerSecond = 0;
  }
  Animatable.prototype = Object.create(EventEmitter.prototype);

  Animatable.prototype.length = function() {
    return this.frameCount / this.framesPerSecond;
  };

  Animatable.prototype.play = function (startTime, weight) {
    if (this.isPlaying) {
      this.stop();
    }

    this.time = startTime !== undefined ? startTime : 0;
    this.weight = weight !== undefined ? weight : 1;

    this.reset();

    this.isPlaying = true;

    AnimationHandler.play(this);
  };

  Animatable.prototype.pause = function() {
    this.isPaused = true;
  };

  Animatable.prototype.unpause = function() {
    this.isPaused = false;
  };

  Animatable.prototype.stop = function () {
    if (!this.isPlaying) {
      return;
    }

    this.isPlaying = false;
    this.isPaused = false;

    AnimationHandler.stop(this);
  };

  Animatable.prototype.update = function (delta) {
    if (this.isPlaying === false) return delta;

    if (!this.isPaused) {
      this.time += delta * this.timeScale;

      // If this is the last frame, we have to stop at the last frame, rather
      //   then blending back towards frame 0, remove that time.
      var endTime = this.length();
      if (this.loop === 1) {
        endTime = (this.frameCount - 1) / this.framesPerSecond;
      }

      if (this.time >= endTime || this.time < 0) {
        if (this.loop === 0 || this.loop > 1) {
          if (this.loop !== 0) {
            this.loop--;
          }

          this.time %= this.length();

          if (this.time < 0) {
            this.time += this.length();
          }

          this.reset();
          this.emit('restart');
        } else {
          var timeConsumed = endTime - this.time;
          this.time = endTime;
          this.pause();
          this.emit('finish');
          return delta - timeConsumed;
        }
      }
    }

    if (this.weight === 0) {
      return 0.0;
    }

    var thisFrame = Math.floor(this.time * this.framesPerSecond);
    // TODO: THIS SHOULD NOT BE NEEDED
    if (thisFrame >= this.frameCount) {
      thisFrame = this.frameCount - 1;
    }
    var nextFrame = thisFrame + 1;
    if (nextFrame >= this.frameCount) {
      if (this.loop) {
        nextFrame -= this.frameCount;
      } else {
        nextFrame = thisFrame;
      }
    }

    var frameRatio = ( this.time - (thisFrame / this.framesPerSecond) ) / (1 / this.framesPerSecond);
    return this.apply(thisFrame, nextFrame, frameRatio);
  };

  Animatable.prototype.reset = function() {
  };

  Animatable.prototype.preUpdate = function() {
  };

  Animatable.prototype.apply = function(frame0, frame1, ratio) {
  };

  FOUR.Animatable = Animatable;

})(FOUR);
