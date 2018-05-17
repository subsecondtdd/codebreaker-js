const {setWorldConstructor} = require("cucumber");
const {WebServer} = require('express-extensions')
const express = require('express')

const DirectSession = require("../../lib/ptb/DirectSession");
const DomSession = require("../../lib/ptb/DomSession");
const HTTPSession = require("../../lib/ptb/HTTPSession");
const CodeBreakerController = require("../../lib/CodeBreakerController");
const DomApp = require('../../lib/dom/DomApp')
const makeExpressRouter = require("../../lib/httpServer/makeExpressRouter");
const Player = require("./Player");

class World {
  constructor() {
    this._cast = {};
    this._controller = new CodeBreakerController();
  }

  async findOrCreatePlayer(playerName) {
    if (this._cast[playerName]) return this._cast[playerName];

    const sessionFactories = {
      DomSession: async controller => {
        const rootElement = document.createElement('div')
        document.body.appendChild(rootElement)
        const domApp = new DomApp({rootElement, controller})
        domApp.showIndex()
        return new DomSession({rootElement})
      },
      HTTPSession: async controller => {
        const app = express()
        app.use(express.json())
        app.use(makeExpressRouter({controller}))

        const webServer = new WebServer(app)
        const port = await webServer.listen(0)
        return new HTTPSession({ baseUrl: `http://localhost:${port}` })
      },
      DirectSession: async controller => {
        return new DirectSession({controller})
      }
    }

    const makeSession = sessionFactories[process.env.SESSION || 'DirectSession']
    const session = await makeSession(this._controller);
    const player = new Player({session});
    this._cast[playerName] = player;
    return player;
  }
}

setWorldConstructor(World);
