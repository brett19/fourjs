var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';
document.body.appendChild(canvas);

var renderer = new Renderer(canvas);

var camera = new Camera();
camera.setPerspective(50, window.innerWidth/window.innerHeight, 1, 10);
camera.position[2] = 5;
camera.updateMatrix();

var scene = new SimpleScene();

var triangles = 500;
var geometry = new Geometry();

/*
var vertices = new Float32Array( triangles * 3 * 3 );
for ( var i = 0, j = 0; i < vertices.length; i++, j += 3 ) {
  vertices[j+0] = Math.random() - 0.5;
  vertices[j+1] = Math.random() - 0.5;
  vertices[j+2] = Math.random() - 0.5;
}
geometry.addAttribute('position', new GeometryData(vertices), 3);

var colors = new Float32Array( triangles * 3 * 4 );
for ( var i = 0, j = 0; i < colors.length; i++, j += 4 ) {
  colors[j+0] = Math.random();
  colors[j+1] = Math.random();
  colors[j+2] = Math.random();
  colors[j+3] = Math.random();
}
geometry.addAttribute('color', new GeometryData(colors), 4);
*/

var vcs = new Float32Array( triangles * 3 * 7 );
for ( var i = 0, j = 0; i < vcs.length; i++, j += 7 ) {
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

var shader = new Shader({
  vertex: document.getElementById('vertexShader').textContent,
  fragment: document.getElementById('fragmentShader').textContent,
  uniforms: {
    modelViewMatrix: Shader.UniformType.ModelViewMatrix,
    projectionMatrix: Shader.UniformType.ProjectionMatrix,
    time: Shader.UniformType.Float
  },
  attributes: [
    'position',
    'color'
  ]
});
var material = new ShaderMaterial(shader, {
  uniforms: {
    time: 1.0
  },
  transparent: true
});

var mesh = new Mesh(geometry, material);
mesh.updateMatrix();
scene.add(mesh);

/*
 uniform mat4 modelViewMatrix; // optional
 uniform mat4 projectionMatrix; // optional

 attribute vec3 position;
 attribute vec4 color;
 */

function renderFrame() {
  requestAnimationFrame(renderFrame, canvas);

  var time = performance.now();

  material.uniforms.time = time * 0.005;
  quat.identity(mesh.rotation);
  quat.rotateY(mesh.rotation, mesh.rotation, time * 0.0005);
  mesh.updateMatrix();

  renderer.render(mesh, camera);
}
renderFrame();
