/**
 * A session that talks directly to a controller, without any UI in-between
 */
module.exports = class ControllerSession {
  constructor({ controller }) {
    this._controller = controller
    this._result = null
  }

  async start() {}

  async stop() {}

  async dispatchCommand({ name, params }) {
    // add gameId to the supplied params
    const { gameId } =
      (this._result && this._result.data && this._result.data) || {}
    params = Object.assign({}, params, { gameId })

    const result = await this._controller.dispatch({ name, params })
    if (result.subscribe) {
      // TODO call listeners
      result.subscribe(result => (this._result = result))
    }
    this._result = result
  }

  async onResult(fn) {
    fn()
  }

  getTestView(name) {
    return this._result.data[name]
  }
}
