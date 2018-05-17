const {setWorldConstructor} = require("cucumber");
const Player = require("./Player");
const DirectSession = require("../../lib/ptb/DirectSession");
const DomSession = require("../../lib/ptb/DomSession");
const HttpSession = require("../../lib/ptb/HttpSession");
const CodeBreakerController = require("../../lib/CodeBreakerController");
const DomApp = require('../../lib/dom/DomApp')
const makeExpressRouter = require('../../lib/httpserver/makeExpressRouter')

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
      HttpSession: async controller => {
        const express = require('express')
        const { WebServer } = require('express-extensions')
        const app = express()
        app.use(express.json({}))
        app.use(makeExpressRouter({controller}))

        const webServer = new WebServer(app)
        const port = await webServer.listen(0)

        const baseUrl = `http://localhost:${port}`
        return new HttpSession({baseUrl})
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
