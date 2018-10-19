module.exports = class BaseActor {
  constructor(pubSub) {
    this._version = 0
    this._pubSub = pubSub
  }

  async start() {
    this._sub = await this._pubSub.makeSubscriber()
    await this._sub.subscribe('version', version => this._version = version)
  }

  stop() {
    this._sub.stop()
  }

  getVersion() {
    return this._version
  }
}
