(function(FOUR) {
  var Geometry = FOUR.Geometry;
  var Shader = FOUR.Shader;
  var ShaderMaterial = FOUR.ShaderMaterial;

  var _DBGAXISVERTS = [
    0, 0, 0,
    0.1, 0, 0,
    0, 0, 0,
    0, 0.1, 0,
    0, 0, 0,
    0, 0, 0.1
  ];
  var _DBGAXISCOLORS = [
    1, 0, 0, 1,
    1, 0, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 0, 1, 1,
    0, 0, 1, 1
  ];
  var _DBGAXISVS = [
    'uniform mat4 modelViewMatrix;',
    'uniform mat4 projectionMatrix;',
    'attribute vec3 position;',
    'attribute vec4 color;',
    'varying vec4 vColor;',
    'void main()	{',
    '  vColor = color;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    '}'
  ].join('\n');
  var _DBGAXISFS = [
    'varying vec3 vPosition;',
    'varying vec4 vColor;',
    'void main()	{',
    '  gl_FragColor = vColor;',
    '}'
  ].join('\n');

  function DebugDraw() {
    var ahGeom = new Geometry();
    ahGeom.addAttribute('position', new Float32Array(_DBGAXISVERTS), 3);
    ahGeom.addAttribute('color', new Float32Array(_DBGAXISCOLORS), 4);
    ahGeom.setDraw(6, 0, Geometry.PrimitiveType.Lines);

    var ahShader = new Shader({
      vertex: _DBGAXISVS,
      fragment: _DBGAXISFS,
      uniforms: {
        modelViewMatrix: Shader.UniformType.ModelViewMatrix,
        projectionMatrix: Shader.UniformType.ProjectionMatrix
      },
      attributes: [
        'position',
        'color'
      ]
    });
    var ahMaterial = new ShaderMaterial(ahShader);

    this.ahGeom = ahGeom;
    this.ahMaterial = ahMaterial;
  }

  FOUR.DebugDraw = DebugDraw;

})(FOUR);