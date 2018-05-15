module.exports = class DirectSession {
  constructor({ controller }) {
    this._controller = controller;
    this._result = {};
  }

  dispatchCommand({ name, params }) {
    let result = this._invokeMethod(name, params);
    if(result.nextQuery) {
      result = this._invokeMethod(result.nextQuery.name, result.nextQuery.params)
    }
    if(result.subscribe) {
      result.subscribe(result => this._result = result)
    }
    this._result = result
  }

  _invokeMethod(name, params) {
    const method = this._controller[name];
    if (!method) throw new Error('No controller method "' + name + '"');
    return method.call(this._controller, params);
  }

  getTestView(name) {
    return this._result.data[name];
  }
};
