var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';
document.body.appendChild(canvas);

var renderer = new Renderer(canvas);

var camera = new Camera();
camera.setPerspective(50, window.innerWidth/window.innerHeight, 1, 1000);
camera.position[0] = 4;
camera.position[1] = -18;
camera.position[2] = 4;

var tvec = vec3.fromValues(0, 0, 2);
camera.lookAt(tvec);

var scene = new SimpleScene();


var tex = TextureLoader.load('/rosedata/cache/tex/lo/png/1a09a252.png', function(err, res) {
  console.log('Image Loaded', err, res);
});




var ahshader = new Shader({
  vertex: document.getElementById('vertexShaderAh').textContent,
  fragment: document.getElementById('fragmentShaderAh').textContent,
  uniforms: {
    modelViewMatrix: Shader.UniformType.ModelViewMatrix,
    projectionMatrix: Shader.UniformType.ProjectionMatrix
  },
  attributes: [
    'position',
    'color'
  ]
});
var ahmaterial = new ShaderMaterial(ahshader, {
  transparent: true
});

var ahgeom = new Geometry();
var ahv = new Float32Array(3 * 6);
ahv[0] = 0;
ahv[1] = 0;
ahv[2] = 0;
ahv[3] = 0.05;
ahv[4] = 0;
ahv[5] = 0;
ahv[6] = 0;
ahv[7] = 0;
ahv[8] = 0;
ahv[9] = 0;
ahv[10] = 0.05;
ahv[11] = 0;
ahv[12] = 0;
ahv[13] = 0;
ahv[14] = 0;
ahv[15] = 0;
ahv[16] = 0;
ahv[17] = 0.05;
ahgeom.addAttribute('position', ahv, 3);
var ahc = new Float32Array(4 * 6);
for (var i = 0; i < 2; ++i) {
  ahc[0+i*4+0] = 1;
  ahc[0+i*4+1] = 0;
  ahc[0+i*4+2] = 0;
  ahc[0+i*4+3] = 1;
}
for (var i = 0; i < 2; ++i) {
  ahc[8+i*4+0] = 0;
  ahc[8+i*4+1] = 1;
  ahc[8+i*4+2] = 0;
  ahc[8+i*4+3] = 1;
}
for (var i = 0; i < 2; ++i) {
  ahc[16+i*4+0] = 0;
  ahc[16+i*4+1] = 0;
  ahc[16+i*4+2] = 1;
  ahc[16+i*4+3] = 1;
}
ahgeom.addAttribute('color', ahc, 4);
ahgeom.setDraw(6, 0, Geometry.PrimitiveType.Lines);

var ahmesh = new Mesh(ahgeom, ahmaterial);
//scene.add(ahmesh);

/*
var mesh = new Mesh(geometry, material);
mesh.position[0] = -1;
mesh.updateMatrix();


var mesh2 = new Mesh(geometry, material);
mesh2.position[0] = 1;
mesh2.updateMatrix();

var obj = new SceneNode();
//obj.position[2] = 0.4;
obj.updateMatrix();

obj.add(mesh);
obj.add(mesh2);
scene.add(obj);
*/
var texXX = DDS.load('3DDATA/NPC/PLANT/JELLYBEAN1/BODY02.DDS');
var texXY = TextureLoader.load(ROSE_DATA_PATH+'3DDATA/NPC/PLANT/JELLYBEAN1/BODY02.png');

var shader = new Shader({
  vertex: document.getElementById('vertexShader').textContent,
  fragment: document.getElementById('fragmentShader').textContent,
  defines: {
    ROSE_SPECULAR: 1
  },
  uniforms: {
    modelViewMatrix: Shader.UniformType.ModelViewMatrix,
    projectionMatrix: Shader.UniformType.ProjectionMatrix,
    time: Shader.UniformType.Float,
    texTest: Shader.UniformType.Sampler2d,
    boneMatrices: Shader.UniformType.BoneMatrices
  },
  attributes: [
    'position',
    'uv',
    'skinWeight',
    'skinIndex'
  ]
});
var material = new ShaderMaterial(shader, {
  uniforms: {
    time: 1.0,
    texTest: texXY
  },
  transparent: true
});

var mtest = null;

RSkeletonData.load('3DDATA/NPC/PLANT/JELLYBEAN1/JELLYBEAN2_BONE.ZMD', function(err, res) {
  console.log(err, res);

  var skeleton = new Skeleton();
  skeleton.position[2] = 0.4;
  skeleton.updateMatrix();

  var bones = [];
  for (var i = 0; i < res.bones.length; ++i) {
    var bone = res.bones[i];

    var boneObj = new SkeletonBone();
    vec3.copy(boneObj.position, bone.position);
    quat.copy(boneObj.rotation, bone.rotation);
    boneObj.updateMatrix(true);

    boneObj.add(new Mesh(ahgeom, ahmaterial))

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


  RMesh.load('3DDATA/NPC/PLANT/JELLYBEAN1/BODY02.ZMS', function(err, res) {
    var mesh = new SkinnedMesh(res, material, skeleton);
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

var cobj = new SceneNode();
scene.add(cobj);
cobj.add(camera);

var prevTime = 0;
function renderFrame() {
  requestAnimationFrame(renderFrame, canvas);
  stats.begin();

  var time = performance.now();
  var dTime = 0;
  if (prevTime > 0) {
    dTime = (time - prevTime) / 1000;
  }
  prevTime = time;

  AnimationHandler.update(dTime);

  material.uniforms.time = time * 0.005;

  if (mtest) {
    //quat.identity(mtest.rotation);
    //quat.rotateZ(mtest.rotation, mtest.rotation, time * 0.0005);
    //mtest.updateMatrix();
  }

  //quat.rotateZ(cobj.rotation, cobj.rotation, dTime * 0.5);
  //cobj.updateMatrix();

  /*
  quat.identity(mesh.rotation);
  quat.rotateY(mesh.rotation, mesh.rotation, time * 0.0005);
  mesh.updateMatrix();

  quat.identity(mesh2.rotation);
  quat.rotateX(mesh2.rotation, mesh2.rotation, time * 0.0005);
  mesh2.updateMatrix();
  */

  renderer.render(scene, camera);

  stats.end();
}
renderFrame();
