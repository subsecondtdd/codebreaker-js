module.exports = class DirectSession {
  constructor({controller}) {
    this._controller = controller;
    this._data = {};
    this._errorMessage = null
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
    if (result.errorMessage) {
      this._errorMessage = result.errorMessage
    } else {
      this._errorMessage = null
    }
    if (result.data) {
      this._data = result.data
    }
  }

  _invokeControllerMethod(name, params) {
    const method = this._controller[name];
    if (!method) throw new Error('No controller method "' + name + '"');
    return method.call(this._controller, params);
  }

  getTestView(name) {
    return this._data[name];
  }

  getErrorMessage() {
    return this._errorMessage;
  }
};
