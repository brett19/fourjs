function Shader(opts) {
  var opts_ = opts || {};

  this.vertex = opts_.vertex;
  this.fragment = opts_.fragment;
  this.defines = opts_.defines || {};
  this.uniforms = opts_.uniforms || {};
  this.attributes = opts_.attributes || [];

  this._glData = null;
}

Shader.UniformType = {
  ModelViewMatrix: 0,
  ProjectionMatrix: 1,
  Float: 2,
  Double: 3,
  Int8: 4,
  Int16: 5,
  Int32: 6,
  Vector2: 7,
  Vector3: 8,
  Vector4: 9,
  Matrix3: 10,
  Matrix4: 11,
  Sampler2d: 12,
  BoneMatrices: 13
};

function ShaderMaterial(shader, opts) {
  var opts_ = opts || {};

  this.shader = shader;
  this.uniforms = opts_.uniforms || {};

  this.transparent = false;
  this.depthWrite = true;
  this.depthTest = true;
  this.blend = true;
  this.blendSrcEq = ShaderMaterial.BlendEquation.Add;
  this.blendDstEq = this.blendSrcEq;
  this.blendSrcColor = ShaderMaterial.BlendFunc.SrcAlpha;
  this.blendSrcAlpha = this.blendSrcColor;
  this.blendDstColor = ShaderMaterial.BlendFunc.OneMinusSrcAlpha;
  this.blendDstAlpha = this.blendDstColor;
}

ShaderMaterial.setBlending  = function(eq, src, dst) {
  this.blendEq = eq;
  this.blendSrcColor = src;
  this.blendDstColor = dst;
  this.blendSrcAlpha = src;
  this.blendDstAlpha = dst;
};

ShaderMaterial.SetBlendingEx = function(eq, srcColor, dstColor, srcAlpha, dstAlpha) {
  this.blendEq = eq;
  this.blendSrcColor = srcColor;
  this.blendDstColor = dstColor;
  this.blendSrcAlpha = srcAlpha;
  this.blendDstAlpha = dstAlpha;
};

ShaderMaterial.BlendEquation = {
  Add: 0,
  Subtract: 1,
  ReverseSubtract: 2
};

ShaderMaterial.BlendFunc = {
  Zero: 0,
  One: 1,
  SrcColor: 2,
  OneMinusSrcColor: 3,
  SrcAlpha: 4,
  OneMinusSrcAlpha: 5,
  DstAlpha: 6,
  OneMinusDstAlpha: 7,
  DstColor: 8,
  OneMinusDstColor: 9,
  SrcAlphaSaturate: 10
};
