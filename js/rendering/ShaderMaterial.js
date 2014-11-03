(function(FOUR) {
  var Shader = FOUR.Shader;

  function ShaderMaterial(shader, opts) {
    var opts_ = opts || {};
    var shader_ = shader;

    if (!(shader_ instanceof Shader)) {
      shader_ = FOUR.shaders.get(shader_);
      if (!(shader_ instanceof Shader)) {
        throw new Error('shader parameter must be a Shader instance or string.');
      }
    }

    this.shader = shader_;
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

  FOUR.ShaderMaterial = ShaderMaterial;

})(FOUR);