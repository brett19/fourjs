(function(FOUR) {

  function Shader(opts) {
    var opts_ = opts || {};

    this.vertex = opts_.vertex;
    this.fragment = opts_.fragment;
    this.defines = opts_.defines || {};
    this.uniforms = opts_.uniforms || {};
    this.attributes = opts_.attributes || [];
    this.precisions = opts_.precisions || {};

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

  FOUR.Shader = Shader;

})(FOUR);
