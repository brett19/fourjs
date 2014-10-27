function RShaderAttribute(name, location) {
  this.name = name;
  this.location = location;
}

function RShaderUniform(name, location, type) {
  this.name = name;
  this.location = location;
  this.type = type;
}

function RShaderData() {
  this.vertex = null;
  this.fragment = null;
  this.program = null;
  this.uniforms = [];
  this.attributes = [];
}

function RBufferData() {
  this.buffer = null;
}

function Renderer(canvas) {
  /**
   * @type {WebGLRenderingContext}
   */
  this._gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  this._curScreenMatrix = null;
  this._curModelViewMatrix = null;
}

Renderer.prototype.bindAttribute = function(location, attribute) {
  var gl = this._gl;
  var buffer = attribute.buffer;

  var bufferData = buffer._glData;
  if (!bufferData) {
    bufferData = new RBufferData();
    buffer._glData = bufferData;

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, buffer.data, gl.STATIC_DRAW);

    bufferData.buffer = buf;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferData.buffer);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, attribute.itemSize, gl.FLOAT, false, buffer.stride, attribute.offset);
};

Renderer.prototype.bindShader = function(shader, uniformValues, attributeBuffers) {
  var gl = this._gl;

  var shaderData = shader._glData;
  if (!shaderData) {
    shaderData = new RShaderData();
    shader._glData = shaderData;

    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, shader.vertex);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(vs));
      return false;
    }
    shaderData.vertex = vs;

    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, shader.fragment);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(fs));
      return false;
    }
    shaderData.fragment = fs;

    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log(gl.getProgramInfoLog(program));
      return false;
    }
    shaderData.program = program;

    var uniforms = shader.uniforms;
    for (var name in uniforms) {
      var location = gl.getUniformLocation(program, name);
      shaderData.uniforms.push(new RShaderUniform(name, location, uniforms[name]));
    }

    var attributes = shader.attributes;
    for (var i = 0, l = attributes.length; i < l; ++i) {
      var name = attributes[i];
      var location = gl.getAttribLocation(program, name);
      shaderData.attributes.push(new RShaderAttribute(name, location));
    }
  }

  gl.useProgram(shaderData.program);

  gl.enable(gl.DEPTH_TEST);
  gl.depthMask(true);
  gl.disable(gl.CULL_FACE);
  gl.enable(gl.BLEND);
  gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  var attributes = shaderData.attributes;
  for (var i = 0, l = attributes.length; i < l; ++i) {
    var attribute = attributes[i];
    var buffer = attributeBuffers[attribute.name];
    if (!buffer) {
      return false;
    }
    this.bindAttribute(attribute.location, buffer);
  }

  var uniforms = shaderData.uniforms;
  for (var i = 0, l = uniforms.length; i < l; ++i) {
    var uniform = uniforms[i];
    var value = uniformValues[uniform.name];
    if (uniform.type === Shader.UniformType.ProjectionMatrix) {
      gl.uniformMatrix4fv(uniform.location, false, this._curScreenMatrix);
    } else if (uniform.type === Shader.UniformType.ModelViewMatrix) {
      gl.uniformMatrix4fv(uniform.location, false, this._curModelViewMatrix);
    } else if (uniform.type === Shader.UniformType.Float) {
      gl.uniform1f(uniform.location, value);
    } else {

    }
  }

  return true;
};

Renderer.prototype.render = function(object, camera) {
  var gl = this._gl;

  gl.clearColor(0.9, 0.9, 0.9, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this._curScreenMatrix = camera.screenMatrix;
  this._curModelViewMatrix = object.matrixWorld;

  var geometry = object.geometry;
  var material = object.material;
  this.bindShader(material.shader, material.uniforms, geometry.attributes);
  gl.drawArrays(gl.TRIANGLES, 0, 500);
};

