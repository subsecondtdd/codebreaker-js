const {setWorldConstructor, After} = require("cucumber");
if (typeof EventSource === 'undefined') {
  global.EventSource = require('eventsource')
}
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch')
}

const ControllerSession = require("../../lib/ptb/ControllerSession");
const DomSession = require("../../lib/ptb/DomSession");
const HTTPController = require("../../lib/controller/HTTPController");
const DomainController = require("../../lib/controller/DomainController");
const DomApp = require('../../lib/dom/DomApp')
const Player = require("./Player");
const makeWebServer = require('../../lib/httpServer/makeWebServer')

class World {
  constructor() {
    this._cast = {};
    this._domainController = new DomainController();
    this._stoppables = []
  }

  async findOrCreatePlayer(playerName) {
    if (this._cast[playerName]) return this._cast[playerName];

    const controllerFactories = {
      DomainController: async () => {
        return this._domainController
      },
      HTTPController: async () => {
        const webServer = makeWebServer({controller: this._domainController, serveClientApp: false})
        const port = await webServer.listen(0)
        this._stoppables.push(webServer)
        return new HTTPController({
          baseUrl: `http://localhost:${port}`,
          fetch: fetch.bind(global),
          EventSource
        })
      }
    }

    const sessionFactories = {
      DomSession: async controller => {
        const rootElement = document.createElement('div')
        document.body.appendChild(rootElement)
        const domApp = new DomApp({rootElement, controller})
        domApp.showIndex()
        return new DomSession({rootElement})
      },
      ControllerSession: async controller => {
        return new ControllerSession({controller})
      }
    }

    const makeController = controllerFactories[process.env.CONTROLLER || 'DomainController']
    const controller = await makeController()
    await controller.start()
    this._stoppables.push(controller)

    const makeSession = sessionFactories[process.env.SESSION || 'ControllerSession']
    const session = await makeSession(controller);
    await session.start()
    this._stoppables.push(session)

    const player = new Player({session});
    this._cast[playerName] = player;
    return player;
  }

  async stop() {
    await Promise.all(this._stoppables.reverse().map(s => s.stop()))
  }
}

After(async function () {
  await this.stop()
})

setWorldConstructor(World);
