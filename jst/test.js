var renderer = new FOUR.Renderer();

var camera = new FOUR.Camera();
camera.setPerspective(50, window.innerWidth/window.innerHeight, 1, 1000);
vec3.set(camera.position, 4, -18, 4);

camera.lookAt(vec3.fromValues(0, 0, 2));

var scene = new FOUR.SimpleScene();

FOUR.shaders.register('test', {
  vertex: document.getElementById('vertexShader').textContent,
  fragment: document.getElementById('fragmentShader').textContent,
  defines: {
    ROSE_SPECULAR: 1
  },
  uniforms: {
    modelViewMatrix: FOUR.Shader.UniformType.ModelViewMatrix,
    projectionMatrix: FOUR.Shader.UniformType.ProjectionMatrix,
    boneMatrices: FOUR.Shader.UniformType.BoneMatrices,
    time: FOUR.Shader.UniformType.Float,
    texTest: FOUR.Shader.UniformType.Sampler2d
  },
  attributes: [
    'position',
    'uv',
    'skinWeight',
    'skinIndex'
  ]
});

var testTex = RTexture.load('3DDATA/NPC/PLANT/JELLYBEAN1/BODY02.DDS');
var material = new FOUR.ShaderMaterial('test', {
  uniforms: {
    time: 1.0,
    texTest: testTex
  },
  transparent: true
});

var mtest = null;

RSkeletonData.load('3DDATA/NPC/PLANT/JELLYBEAN1/JELLYBEAN2_BONE.ZMD', function(err, res) {
  
  var skeleton = new FOUR.Skeleton();
  skeleton.position[2] = 0.4;
  skeleton.updateMatrix();

  var bones = [];
  for (var i = 0; i < res.bones.length; ++i) {
    var bone = res.bones[i];

    var boneObj = new FOUR.SkeletonBone();
    vec3.copy(boneObj.position, bone.position);
    quat.copy(boneObj.rotation, bone.rotation);
    boneObj.updateMatrix(true);

    if (i > 0) {
      bones[bone.parent].add(boneObj);
    } else {
      skeleton.add(boneObj);
    }

    bones.push(boneObj);
  }
  skeleton.bones = bones;
  skeleton.updateMatrixWorld();
  skeleton.setBindPose();

  scene.add(skeleton);

  scene.add(new FOUR.SkeletonHelper(skeleton));


  RMesh.load('3DDATA/NPC/PLANT/JELLYBEAN1/BODY02.ZMS', function(err, res) {
    var mesh = new FOUR.SkinnedMesh(res, material, skeleton);
    scene.add(mesh);

    console.log(res);

    mtest = mesh;
  });

  RAnimationData.load('3DDATA/MOTION/NPC/JELLYBEAN1/JELLYBEAN1_WALK.ZMO', function(err, res) {
    console.log(err, res);

    var anim = new Animator(bones, res);
    anim.play();

  });
});


var stats = new Stats();
stats.setMode(1);
if (true) {
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);
}

var cobj = new FOUR.SceneNode();
scene.add(cobj);
cobj.add(camera);

FOUR.frame(function(delta) {
  stats.begin();

  AnimationHandler.update(delta);

  material.uniforms.time += delta * 0.005;

  renderer.render(scene, camera);

  stats.end();
});
