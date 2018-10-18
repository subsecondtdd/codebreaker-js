module.exports = class ActiveState {
  constructor(pubSub) {
    this._pubSub = pubSub
  }

  async start() {
    this._subscriber = await this._pubSub.makeSubscriber()
  }

  async observe(topic, update, listener) {
    await this._subscriber.subscribe(topic, async () => {
      listener(await update())
    })
    listener(await update())
  }
}
