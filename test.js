var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';
document.body.appendChild(canvas);

var renderer = new Renderer(canvas);

var camera = new Camera();
camera.setPerspective(50, window.innerWidth/window.innerHeight, 1, 50);
camera.position[1] = -10;

var tvec = vec3.fromValues(0, 0, 0);
camera.lookAt(tvec);

var scene = new SimpleScene();

var triangles = 500;
var geometry = new Geometry();

//*
var vertices = new Float32Array( triangles * 3 * 3 );
for ( var i = 0, j = 0; i < vertices.length; i++, j += 3 ) {
  vertices[j+0] = Math.random() - 0.5;
  vertices[j+1] = Math.random() - 0.5;
  vertices[j+2] = Math.random() - 0.5;
}
geometry.addAttribute('position', vertices, 3);

var colors = new Float32Array( triangles * 3 * 4 );
for ( var i = 0, j = 0; i < colors.length; i++, j += 4 ) {
  colors[j+0] = Math.random();
  colors[j+1] = Math.random();
  colors[j+2] = Math.random();
  colors[j+3] = Math.random();
}
geometry.addAttribute('color', colors, 4);
//geometry.setDraw(500);
//*/
//*
var vcs = new Float32Array(triangles * 3 * 7);
for (var j = 0; j < vcs.length; j += 7) {
  vcs[j+0] = Math.random() - 0.5;
  vcs[j+1] = Math.random() - 0.5;
  vcs[j+2] = Math.random() - 0.5;
  vcs[j+3] = Math.random();
  vcs[j+4] = Math.random();
  vcs[j+5] = Math.random();
  vcs[j+6] = Math.random();
}
var vcsdata = new GeometryData(vcs, 4*7);
geometry.addAttribute('position', vcsdata, 3, 4*0);
geometry.addAttribute('color', vcsdata, 4, 4*3);

var idxs = new Uint16Array(triangles * 3 * 7);
for (var i = 0; i < idxs.length; ++i) {
  idxs[i] = i;
}
var idxsdata = new GeometryData(idxs);
geometry.setIndices(idxsdata, 500, 0);
//*/

var tex = TextureLoader.load('/rosedata/cache/tex/lo/png/1a09a252.png', function(err, res) {
  console.log('Image Loaded', err, res);
});

var shader = new Shader({
  vertex: document.getElementById('vertexShader').textContent,
  fragment: document.getElementById('fragmentShader').textContent,
  uniforms: {
    modelViewMatrix: Shader.UniformType.ModelViewMatrix,
    projectionMatrix: Shader.UniformType.ProjectionMatrix,
    time: Shader.UniformType.Float,
    testTex: Shader.UniformType.Sampler2d
  },
  attributes: [
    'position',
    'color'
  ]
});
var material = new ShaderMaterial(shader, {
  uniforms: {
    time: 1.0,
    testTex: tex
  },
  transparent: true
});

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

/*
 uniform mat4 modelViewMatrix; // optional
 uniform mat4 projectionMatrix; // optional

 attribute vec3 position;
 attribute vec4 color;
 */

var stats = new Stats();
stats.setMode(1);
if (true) {
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);
}

function renderFrame() {
  requestAnimationFrame(renderFrame, canvas);
  stats.begin();

  var time = performance.now();

  material.uniforms.time = time * 0.005;

  quat.identity(mesh.rotation);
  quat.rotateY(mesh.rotation, mesh.rotation, time * 0.0005);
  mesh.updateMatrix();

  quat.identity(mesh2.rotation);
  quat.rotateX(mesh2.rotation, mesh2.rotation, time * 0.0005);
  mesh2.updateMatrix();

  renderer.render(scene, camera);

  stats.end();
}
renderFrame();
