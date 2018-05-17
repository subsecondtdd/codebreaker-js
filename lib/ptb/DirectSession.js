module.exports = class DirectSession {
  constructor({controller}) {
    this._controller = controller
    this._result = {}
  }

  async start() {}

  dispatchCommand({name, params}) {
    const result = this._controller.dispatch({name, params})
    if (result.subscribe) {
      result.subscribe(result => this._result = result)
    }
    this._result = result
  }

  getTestView(name) {
    return this._result.data[name];
  }
};
