module.exports = class DirectSession {
  constructor({ controller }) {
    this._controller = controller;
    this._result = {};
  }

  dispatchCommand({ name, params }) {
    const method = this._controller[name];
    if (!method) throw new Error('No controller method "' + name + '"');
    method.call(this._controller, params);

    this._result = this._controller['showGame'].call(this._controller, {})
  }

  getTestView(name) {
    return this._result.data[name];
  }
};
