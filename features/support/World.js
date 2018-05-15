const {setWorldConstructor} = require("cucumber");
const Player = require("./Player");
const DirectSession = require("../../lib/ptb/DirectSession");
const DomSession = require("../../lib/ptb/DomSession");
const CodeBreakerController = require("../../lib/CodeBreakerController");
const renderDom = require('../../lib/dom/renderDom')

class World {
  constructor() {
    this._cast = {};
    this._controller = new CodeBreakerController();
  }

  findOrCreatePlayer(playerName) {
    if (this._cast[playerName]) return this._cast[playerName];

    const sessionFactories = {
      DomSession: controller => {
        const session = new DirectSession({controller})
        return new DomSession({render: renderDom(session)})
      },
      DirectSession: controller => {
        return new DirectSession({controller})
      }
    }

    const makeSession = sessionFactories[process.env.SESSION || 'DirectSession']
    const session = makeSession(this._controller);
    const player = new Player({session});
    this._cast[playerName] = player;
    return player;
  }
}

setWorldConstructor(World);
