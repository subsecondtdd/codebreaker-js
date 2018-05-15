module.exports = class DirectSession {
  constructor({ controller }) {
    this._controller = controller;
    this._result = {};
  }

  dispatchCommand({ name, params }) {
    const method = this._controller[name];
    if (!method) throw new Error('No controller method "' + name + '"');
    this._result = method.call(this._controller, params);
  }

  getTestView(name) {
    return this._result.data[name];
  }
};
