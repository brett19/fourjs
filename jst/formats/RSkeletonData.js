RSkeletonBone = function() {
  this.parent = -1;
  this.name = '';
  this.position = null;
  this.rotation = null;
};

function RSkeletonData() {
  this.bones = [];
  this.dummies = [];
};

RSkeletonData.load = function(path, callback) {
  RoseLoader.load(path, function(err, rh) {
    if (err) {
      callback(err, null);
      return;
    }

    var bones, dummies, i, magic, version;
    var data = new RSkeletonData();

    magic = rh._readStringWithLen(7);
    if (magic === 'ZMD0002') {
      version = 2;
    } else if (magic === 'ZMD0003') {
      version = 3;
    } else {
      callback(new Error('Unexpected ZMD magic header ' + magic + ' in ' + path), null);
      return;
    }

    bones = rh.readUint32();
    for (var i = 0; i < bones; ++i) {
      var bone = new RSkeletonBone();
      bone.parent   = rh.readUint32();
      bone.name     = rh._readString();
      bone.position = rh.readVector3();
      bone.rotation = rh.readQuatwxyz();

      vec3.multiply(bone.position, bone.position, [0.01, 0.01, 0.01]);

      if (i == 0) {
        bone.parent = -1;
      }

      data.bones.push(bone);
    }

    dummies = rh.readUint32();
    for (i = 0; i < dummies; ++i) {
      var dummy = new RSkeletonBone();
      dummy.name     = rh._readString();
      dummy.parent   = rh.readUint32();
      dummy.position = rh.readVector3();

      vec3.multiply(dummy.position, dummy.position, [0.01, 0.01, 0.01]);

      if (version === 3) {
        dummy.rotation = rh.readQuatwxyz();
      } else {
        dummy.rotation = quat.create();
      }

      data.dummies.push(dummy);
    }

    callback(null, data);
  });
};
