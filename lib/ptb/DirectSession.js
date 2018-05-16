module.exports = class DirectSession {
  constructor({controller}) {
    this._controller = controller
    this._result = {}
  }

  dispatchCommand({name, params}) {
    let result
    while (true) {
      const method = this._controller[name];
      if (!method) throw new Error('No controller method "' + name + '"');
      result = method.call(this._controller, params);
      if (!result.nextQuery) break
      name = result.nextQuery.name
      params = result.nextQuery.params
    }

    if (result.subscribe) {
      result.subscribe(result => {
        this._result = result
      })
    }
    this._result = result
  }

  getTestView(name) {
    return this._result.data[name];
  }
};
