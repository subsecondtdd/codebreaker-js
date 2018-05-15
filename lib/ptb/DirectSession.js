module.exports = class DirectSession {
  constructor({ controller }) {
    this._controller = controller;
    this._result = {};
  }

  dispatchCommand({ name, params }) {
    const result = this._invokeMethod(name, params);
    if(result.nextQuery) {
      this._result = this._invokeMethod(result.nextQuery.name, result.nextQuery.params)
    }
  }

  _invokeMethod(name, params) {
    const method = this._controller[name];
    if (!method) throw new Error('No controller method "' + name + '"');
    const result = method.call(this._controller, params);
    return result;
  }

  getTestView(name) {
    return this._result.data[name];
  }
};
