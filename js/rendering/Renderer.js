function RShaderAttribute(name, location) {
  this.name = name;
  this.location = location;
}

function RShaderUniform(name, location, type) {
  this.name = name;
  this.location = location;
  this.type = type;
  this.value = [];
}

function RShaderData() {
  this.vertex = null;
  this.fragment = null;
  this.program = null;
  this.uniforms = [];
  this.attributes = [];
}

function RTextureData() {
  this.texture = null;
}

function RBufferData() {
  this.buffer = null;
  this.bufferSize = 0;
}




function Renderer(canvas) {
  /**
   * @type {WebGLRenderingContext}
   */
  this._gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  this._curScreenMatrix = null;
  this._curModelViewMatrix = null;

  // State Tracking
  this._glEnabledFlags = {};
  this._glBlendFunc = [];
  this._glBlendEq = [];
  this._glDepthMaskEnabled = undefined;
  this._glCurVertexBuffer = undefined;
  this._glCurIndexBuffer = undefined;
  this._glEnabledAttribs = {};
  this._glCurBuffers = [];
  this._glCurTexStage = undefined;
  this._glCurTexture = [];
  this._activeShader = undefined;
}

Renderer.prototype.glEnable = function(what) {
  if (this._glEnabledFlags[what] !== true) {
    this._gl.enable(what);
    this._glEnabledFlags[what] = true;
  }
};

Renderer.prototype.glDisable = function(what) {
  if (this._glEnabledFlags[what] !== false) {
    this._gl.disable(what);
    this._glEnabledFlags[what] = false;
  }
};

Renderer.prototype.glBlendEquation = function(modeRGB, modeAlpha) {
  if (this._glBlendEq[0] !== modeRGB || this._glBlendEq[1] !== modeAlpha) {
    this._gl.blendEquationSeparate(modeRGB, modeAlpha);
    this._glBlendEq[0] = modeRGB;
    this._glBlendEq[1] = modeAlpha;
  }
};

Renderer.prototype.glBlendFunc = function(srcRGB, dstRGB, srcAlpha, dstAlpha) {
  if (this._glBlendFunc[0] !== srcRGB || this._glBlendFunc[1] !== dstRGB ||
          this._glBlendFunc[2] !== srcAlpha || this._glBlendFunc[3] !== dstAlpha) {
    this._gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
    this._glBlendFunc[0] = srcRGB;
    this._glBlendFunc[1] = dstRGB;
    this._glBlendFunc[2] = srcAlpha;
    this._glBlendFunc[3] = dstAlpha;
  }
};

Renderer.prototype.glDepthMask = function(enabled) {
  if (this._glDepthMaskEnabled !== enabled) {
    this._gl.depthMask(enabled);
    this._glDepthMaskEnabled = enabled;
  }
};

Renderer.prototype.useShader = function(shader) {
  if (this._activeShader !== shader) {
    this._gl.useProgram(shader.program);
    this._activeShader = shader;
  }
};

Renderer.prototype.shaderSetInt = function(uniform, i) {
  var cv = uniform.value;
  if (cv[0] !== i) {
    this._gl.uniform1i(uniform.location, i);
    cv[0] = i;
  }
};

Renderer.prototype.shaderSetFloat = function(uniform, f) {
  var cv = uniform.value;
  if (cv[0] !== f) {
    this._gl.uniform1f(uniform.location, f);
    cv[0] = f;
  }
};

Renderer.prototype.shaderSetVector2f = function(uniform, v) {
  var cv = uniform.value;
  if (cv[0] !== v[0] || cv[1] !== v[1]) {
    this._gl.uniform2fv(uniform.location, v);
    cv[0] = v[0]; cv[1] = v[1];
  }
};

Renderer.prototype.shaderSetVector3f = function(uniform, v) {
  var cv = uniform.value;
  if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
    this._gl.uniform2fv(uniform.location, v);
    cv[0] = v[0]; cv[1] = v[1]; cv[2] = v[2];
  }
};

Renderer.prototype.shaderSetVector4f = function(uniform, v) {
  var cv = uniform.value;
  if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
    this._gl.uniform2fv(uniform.location, v);
    cv[0] = v[0]; cv[1] = v[1]; cv[2] = v[2]; cv[3] = v[3];
  }
};

Renderer.prototype.shaderSetMatrix4f = function(uniform, m) {
  var cv = uniform.value;
  if (cv[0] !== m[0] || cv[1] !== m[1] || cv[2] !== m[2] || cv[3] !== m[3] ||
      cv[4] !== m[4] || cv[5] !== m[5] || cv[6] !== m[6] || cv[7] !== m[7] ||
      cv[8] !== m[8] || cv[9] !== m[9] || cv[10] !== m[10] || cv[11] !== m[11] ||
      cv[12] !== m[12] || cv[13] !== m[13] || cv[14] !== m[14] || cv[15] !== m[15]) {
    this._gl.uniformMatrix4fv(uniform.location, false, m);
    cv[0] = m[0]; cv[1] = m[1]; cv[2] = m[2]; cv[3] = m[3];
    cv[4] = m[4]; cv[5] = m[5]; cv[6] = m[6]; cv[7] = m[7];
    cv[8] = m[8]; cv[9] = m[9]; cv[10] = m[10]; cv[11] = m[11];
    cv[12] = m[12]; cv[13] = m[13]; cv[14] = m[14]; cv[15] = m[15];
  }
};

Renderer.prototype.glActiveTexture = function(index) {
  if (this._glCurTexStage !== index) {
    this._gl.activeTexture(this._gl.TEXTURE0 + index);
    this._glCurTexStage = index;
  }
};

Renderer.prototype.glBindTexture = function(target, texture) {
  if (this._glCurTexture[this._glCurTexStage] !== texture) {
    this._gl.bindTexture(target, texture);
    this._glCurTexture[this._glCurTexStage] = texture;
  }
};

Renderer.prototype.glEnableVertexAttribArray = function(index) {
  if (this._glEnabledAttribs[index] !== true) {
    this._gl.enableVertexAttribArray(index);
    this._glEnabledAttribs[index] = true;
  }
};

Renderer.prototype.glDisableVertexAttribArray = function(index) {
  if (this._glEnabledAttribs[index] !== false) {
    this._gl.disableVertexAttribArray(index);
    this._glEnabledAttribs[index] = false;
  }
};

Renderer.prototype.glBindBuffer = function(target, buffer) {
  var gl = this._gl;
  if (target === gl.ARRAY_BUFFER) {
    if (this._glCurVertexBuffer !== buffer) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      this._glCurVertexBuffer = buffer;
    }
  } else if (target === gl.ELEMENT_ARRAY_BUFFER) {
    if (this._glCurIndexBuffer !== buffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
      this._glCurIndexBuffer = buffer;
    }
  } else {
    gl.bindBuffer(target, buffer);
  }
};

Renderer.prototype.uploadBuffer = function(target, buffer) {
  var gl = this._gl;
  var bufferData = buffer._glData;
  if (!bufferData) {
    bufferData = new RBufferData();
    buffer._glData = bufferData;

    var buf = gl.createBuffer();
    bufferData.buffer = buf;

    // Force a refresh
    buffer.needsUpdate = true;
  }

  if (buffer.needsUpdate) {
    this.glBindBuffer(target, bufferData.buffer);

    if (bufferData.bufferSize !== buffer.data.byteLength) {
      gl.bufferData(target, buffer.data, gl.STATIC_DRAW);
      bufferData.bufferSize = buffer.data.byteLength;
    } else {
      gl.bufferSubData(target, 0, buffer.data);
    }
    buffer.needsUpdate = false;
  }

  return bufferData;
};

Renderer.prototype.bindVertexBuffer = function(index, buffer, size, type, normalized, offset) {
  var gl = this._gl;
  var stride = buffer.stride;
  var bufferData = this.uploadBuffer(gl.ARRAY_BUFFER, buffer);

  var cv = this._glCurBuffers[index];
  if (!cv) {
    cv = [];
    this._glCurBuffers[index] = cv;
  }

  if (cv[0] !== buffer || cv[1] !== size || cv[2] !== type ||
      cv[3] !== normalized || cv[4] !== stride || cv[5] !== offset) {
    this.glBindBuffer(gl.ARRAY_BUFFER, bufferData.buffer);
    gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    cv[0] = buffer;
    cv[1] = size;
    cv[2] = type;
    cv[3] = normalized;
    cv[4] = stride;
    cv[5] = offset;
  }
};

Renderer.prototype.bindIndexBuffer = function(buffer) {
  var gl = this._gl;
  var bufferData = this.uploadBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  this.glBindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferData.buffer);
};

Renderer.prototype.bindAttributes = (function() {
  var attribNeedDisable_ = [];
  return function(attributes, attributeBuffers) {
    var gl = this._gl;

    for (var i = 0, l = attribNeedDisable_.length; i < l; ++i) {
      attribNeedDisable_[i] = false;
    }
    var enabledAttribs = this._glEnabledAttribs;
    for (var i = 0, l = enabledAttribs.length; i < l; ++i) {
      if (enabledAttribs[i] === true) {
        attribNeedDisable_[i] = true;
      }
    }

    for (var i = 0, l = attributes.length; i < l; ++i) {
      var attribute = attributes[i];
      var attributeData = attributeBuffers[attribute.name];
      if (!attributeData) {
        return false;
      }

      this.glEnableVertexAttribArray(attribute.location);
      this.bindVertexBuffer(attribute.location, attributeData.buffer, attributeData.itemSize, gl.FLOAT, false, attributeData.offset);
      attribNeedDisable_[attribute.location] = false;
    }

    for (var i = 0, l = attribNeedDisable_.length; i < l; ++i) {
      if (attribNeedDisable_[i]) {
        this.glDisableVertexAttribArray(i);
      }
    }

    return true;
  };
})();

Renderer.prototype.bindUniforms = function(uniforms, uniformValues) {
  var gl = this._gl;
  var texStageNum = 0;
  for (var i = 0, l = uniforms.length; i < l; ++i) {
    var uniform = uniforms[i];
    var value = uniformValues[uniform.name];
    if (uniform.type === Shader.UniformType.ProjectionMatrix) {
      this.shaderSetMatrix4f(uniform, this._curScreenMatrix);
    } else if (uniform.type === Shader.UniformType.ModelViewMatrix) {
      this.shaderSetMatrix4f(uniform, this._curModelViewMatrix);
    } else if (uniform.type === Shader.UniformType.Matrix4) {
      this.shaderSetMatrix4f(uniform, value);
    } else if (uniform.type === Shader.UniformType.Vector2) {
      this.shaderSetVector2f(uniform, value);
    } else if (uniform.type === Shader.UniformType.Vector3) {
      this.shaderSetVector3f(uniform, value);
    } else if (uniform.type === Shader.UniformType.Vector4) {
      this.shaderSetVector4f(uniform, value);
    } else if (uniform.type === Shader.UniformType.Float) {
      this.shaderSetFloat(uniform, value);
    } else if (uniform.type === Shader.UniformType.Sampler2d) {
      var myStageNum = texStageNum++;
      this.glActiveTexture(myStageNum);
      this.bindTexture(value);
      this.shaderSetInt(uniform, myStageNum);
    } else {
      console.warn('Unexpected shader uniform type', uniform);
    }
  }
  return true;
};

Renderer.prototype.buildShaderData = function(shaderData, shader) {
  var gl = this._gl;

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

  return true;
};

Renderer.prototype._ftoglImageFormat = function(val) {
  if (val === Texture.Format.RGB) {
    return this._gl.RGB;
  } else if (val === Texture.Format.RGBA) {
    return this._gl.RGBA;
  }
  return this._gl.NONE;
};

Renderer.prototype._ftoglPixelFormat = function(val) {
  if (val === Texture.PixelFormat.UnsignedByte) {
    return this._gl.UNSIGNED_BYTE;
  }
  return this._gl.NONE;
};

Renderer.prototype._ftoglGeomDataFormat = function(val) {
  if (val === GeometryData.Format.UnsignedByte) {
    return this._gl.UNSIGNED_BYTE;
  } else if (val === GeometryData.Format.UnsignedShort) {
    return this._gl.UNSIGNED_SHORT;
  } else if (val === GeometryData.Format.UnsignedInt) {
    return this._gl.UNSIGNED_INT;
  }
  return this._gl.NONE;
};

Renderer.prototype._ftoglPrimitiveType = function(val) {
  if (val === Geometry.PrimitiveType.Triangles) {
    return this._gl.TRIANGLES;
  } else if (val === Geometry.PrimitiveType.TriangleStrip) {
    return this._gl.TRIANGLE_STRIP;
  }
  return this._gl.NONE;
};

Renderer.prototype.bindTexture = function(texture) {
  var gl = this._gl;

  if (!texture.data) {
    gl.bindTexture(gl.TEXTURE_2D, null);
    return;
  }

  var textureData = texture._glData;
  if (!textureData) {
    textureData = new RTextureData();
    texture._glData = textureData;

    textureData.texture = gl.createTexture();
  }

  this.glBindTexture(gl.TEXTURE_2D, textureData.texture);

  if (texture.needsUpdate) {
    var glImageFormat = this._ftoglImageFormat(texture.format);
    var glPixelFormat = this._ftoglPixelFormat(texture.pixelFormat);
    gl.texImage2D(gl.TEXTURE_2D, 0, glImageFormat, glImageFormat, glPixelFormat, texture.data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    texture.needsUpdate = false;
  }
};

Renderer.prototype.bindShader = function(shader, uniformValues, attributeBuffers) {
  var gl = this._gl;

  var shaderData = shader._glData;
  if (!shaderData) {
    shaderData = new RShaderData();
    shader._glData = shaderData;
    if (!this.buildShaderData(shaderData, shader)) {
      return false;
    }
  }

  this.useShader(shaderData);

  this.glEnable(gl.DEPTH_TEST);
  this.glDisable(gl.CULL_FACE);
  this.glEnable(gl.BLEND);

  this.glDepthMask(true);
  this.glBlendEquation(gl.FUNC_ADD, gl.FUNC_ADD);
  this.glBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  if (!this.bindAttributes(shaderData.attributes, attributeBuffers)) {
    return false;
  }

  if (!this.bindUniforms(shaderData.uniforms, uniformValues)) {
    return false;
  }

  return true;
};

Renderer.prototype.renderGeom = function(geometry, material) {
  var gl = this._gl;

  this.bindShader(material.shader, material.uniforms, geometry.attributes);

  var primType = this._ftoglPrimitiveType(geometry.primType);
  if (geometry.indexBuffer) {
    this.bindIndexBuffer(geometry.indexBuffer);
    var indexDataFmt = this._ftoglGeomDataFormat(geometry.indexFormat);
    gl.drawElements(primType, geometry.drawCount, indexDataFmt, geometry.drawOffset);
  } else {
    gl.drawArrays(primType, geometry.drawOffset, geometry.drawCount);
  }
};

Renderer.prototype.render = function(scene, camera) {
  var gl = this._gl;

  gl.clearColor(0.9, 0.9, 0.9, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this._curScreenMatrix = camera.screenMatrix;

  scene.foreachInFrustum(null, function(obj) {
    if (obj instanceof Mesh) {
      this._curModelViewMatrix = obj.matrixWorld;
      this.renderGeom(obj.geometry, obj.material);
    }
  }.bind(this));
};

