const {setWorldConstructor, Before, After} = require('cucumber')
const DirectActor = require('./actors/DirectActor')
const DomActor = require('./actors/DomActor')
const {MemoryPubSub, EventSourcePubSub} = require('pubsub-multi')
const Codebreaker = require('../../lib/codebreaker/Codebreaker')
const HttpCodebreaker = require('../../lib/codebreaker/HttpCodebreaker')
const VersionWatcher = require('./extract/VersionWatcher')
const makeWebApp = require('../../lib/server/makeWebApp')
const {WebServer} = require('express-extensions')

if (typeof EventSource !== 'function') {
  global.EventSource = require('eventsource')
}
if (typeof fetch !== 'function') {
  global.fetch = require('node-fetch')
} else {
  global.fetch = window.fetch.bind(window)
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

    const pubSub = await this.makeActorPubSub()
    const codebreaker = await this.makeActorCodebreaker(pubSub.port)

    const makers = {
      DirectActor: () => {
        return new DirectActor(actorName, codebreaker, pubSub)
      },

      DomActor: () => {
        return new DomActor(actorName, codebreaker, pubSub)
      }
    }
    const actor = makers[process.env.ACTOR]()
    await actor.start()
    this._actors[actorName] = actor
    this._stoppables.push(actor)
    const sub = await pubSub.makeSubscriber()
    this._stoppables.push(sub)
    this._versionWatchers.push(new VersionWatcher(actor, sub))
    return actor
  }

  async makeActorCodebreaker(port) {
    const makers = {
      Codebreaker: () => {
        return this._codebreaker
      },

      HttpCodebreaker: async () => {
        if (typeof port !== 'number') throw new Error(`No port: ${port}`)
        const baseUrl = `http://localhost:${port}`
        return new HttpCodebreaker(baseUrl, fetch)
      }
    }

    return await makers[process.env.API]()
  }

  async makeActorPubSub() {
    const makers = {
      Codebreaker: () => {
        return this._pubSub
      },

      HttpCodebreaker: async () => {
        let port = null
        const pubSub = new EventSourcePubSub(fetch, EventSource, () => {
          if (typeof port !== 'number') throw new Error(`No port: ${port}`)
          return `http://localhost:${port}/api/pubsub`
        })
        const app = makeWebApp(this._codebreaker, this._pubSub)
        const webServer = new WebServer(app)
        this._stoppables.push(webServer)
        port = await webServer.listen(0)
        pubSub.port = port
        return pubSub
      }
    }

    return await makers[process.env.API]()
  }

  async synchronized() {
    return VersionWatcher.synchronized(this._versionWatchers)
  }

  async start() {
    const sub = await this._pubSub.makeSubscriber()
    this._stoppables.push(sub)
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
