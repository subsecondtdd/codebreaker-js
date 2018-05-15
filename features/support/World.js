const { setWorldConstructor } = require("cucumber");
const Player = require("./Player");
const DirectSession = require("../../lib/ptb/DirectSession");
const CodeBreakerController = require("../../lib/CodeBreakerController");

class World {
  constructor() {
    this._cast = {};
  }

  findOrCreatePlayer(playerName) {
    if (this._cast[playerName]) return this._cast[playerName];

    const controller = new CodeBreakerController();
    const session = new DirectSession({ controller });
    const player = new Player({ session });
    this._cast[playerName] = player;
    return player;
  }
}
setWorldConstructor(World);
