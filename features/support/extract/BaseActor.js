module.exports = class BaseActor {
  constructor(sub) {
    this._version = 0
    this._sub = sub
  }

  async start() {
    await this._sub.subscribe('version', version => this._version = version)
  }

  stop() {
    this._sub.stop()
  }

  getVersion() {
    return this._version
  }
}
