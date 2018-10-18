const {setWorldConstructor, Before, After} = require('cucumber')
const DirectActor = require('./actors/DirectActor')
const DomActor = require('./actors/DomActor')
const {MemoryPubSub} = require('pubsub-multi')
const Codebreaker = require('../../lib/domain/Codebreaker')

if (typeof EventSource === 'undefined') {
  global.EventSource = require('eventsource')
}
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch')
}

class VersionWatcher {
  constructor(subject, sub) {
    if (!sub) throw new Error("No sub")
    if (typeof sub.subscribe !== 'function') throw new Error(`No #subscribe for ${sub}`)
    this._subject = subject
    this._sub = sub
  }

  getVersion() {
    return this._subject.getVersion()
  }

  async waitForVersion(expectedVersion) {
    const synchronized = new Promise((resolve, reject) => {
      if (this.getVersion() === expectedVersion) {
        return resolve()
      }
      this._sub.subscribe('version', version => {
        if (version === expectedVersion) resolve()
      }).catch(reject)
    })
    const timedOut = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`Timed out waiting for ${this._subject} to get version ${expectedVersion}. Current version: ${this.getVersion()}`))
      }, 200)
    })
    return Promise.race([synchronized, timedOut])
  }
}

class World {
  constructor() {
    this._actors = {}
    this._pubSub = new MemoryPubSub({version: () => this._codebreaker.getVersion()})
    this._codebreaker = new Codebreaker(this._pubSub)
    this._stoppables = []
    this._versionWatchers = []
  }

  async getActor(actorName) {
    if (this._actors[actorName]) return this._actors[actorName]

    const pubSub = this._pubSub

    const makers = {
      DirectActor: () => {
        return new DirectActor(actorName, this._codebreaker, pubSub)
      },

      DomActor: () => {
        return new DomActor(actorName, this._codebreaker, pubSub)
      }
    }
    const actor = makers[process.env.ACTOR]()
    // TODO: Don't start until the actor becomes "active"?
    await actor.start()
    this._actors[actorName] = actor
    const sub = await pubSub.makeSubscriber()
    this._versionWatchers.push(new VersionWatcher(actor, sub))
    return actor
  }

  async synchronized() {
    if (this._versionWatchers.length === 0) {
      throw new Error("No versions to synchronize")
    }
    const versions = this._versionWatchers.map(versionWatcher => {
      const version = versionWatcher.getVersion();
      if (typeof version !== 'number' || isNaN(version)) throw new Error(`Not a version number: ${expectedVersion}`)
      return version
    });
    const maxVersion = Math.max(...versions)
    await Promise.all(
      this._versionWatchers.map(versionWatcher => versionWatcher.waitForVersion(maxVersion))
    )
  }

  async start() {
    const sub = await this._pubSub.makeSubscriber()
    this._versionWatchers.push(new VersionWatcher(this._codebreaker, sub))
  }

  async stop() {
    for (const stoppable of this._stoppables.reverse()) {
      await stoppable.stop()
    }
  }
}

Before(async function () {
  await this.start()
})

After(async function () {
  await this.stop()
})

setWorldConstructor(World)
