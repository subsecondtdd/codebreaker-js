module.exports = class BaseActor {
  constructor(pubSub) {
    this._version = 0
    this._pubSub = pubSub
  }

  async start() {
    const sub = await this._pubSub.makeSubscriber()
    await sub.subscribe('version', version => this._version = version)
  }

  stop() {
  }

  getVersion() {
    return this._version
  }
}
