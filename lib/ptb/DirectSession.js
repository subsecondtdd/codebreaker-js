module.exports = class DirectSession {
  constructor({controller}) {
    this._controller = controller;
    this._data = {};
  }

  dispatchCommand({name, params}) {
    let result
    while (true) {
      result = this._invokeControllerMethod(name, params)
      if (!result.nextQuery) break
      name = result.nextQuery.name
      params = result.nextQuery.params
    }
    if (result.subscribe) {
      result.subscribe(result => {
        this._data = result.data
      })
    }
    this._data = Object.assign({}, this._data, result.data)
  }

  _invokeControllerMethod(name, params) {
    const method = this._controller[name];
    if (!method) throw new Error('No controller method "' + name + '"');
    return method.call(this._controller, params);
  }

  getTestView(name) {
    return this._data[name];
  }
};
