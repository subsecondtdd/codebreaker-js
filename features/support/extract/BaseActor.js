module.exports = class BaseActor {
  constructor(name, sub) {
    this._version = 0
    this._name = name
    this._sub = sub
  }

  getName() {
    return this._name
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
