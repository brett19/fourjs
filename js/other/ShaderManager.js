(function(FOUR) {
  var Shader = FOUR.Shader;

  function ShaderManager() {
    this._entries = {};
  }

  ShaderManager.prototype.get = function(name) {
    return this._entries[name];
  };

  ShaderManager.prototype.register = function(name, opts) {
    var shader = opts;
    if (!(shader instanceof Shader)) {
      shader = new Shader(shader);
    }
    this._entries[name] = shader;
  };

  FOUR.shaders = new ShaderManager();

})(FOUR);
