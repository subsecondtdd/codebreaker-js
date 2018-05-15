const { setWorldConstructor } = require("cucumber");
const Player = require("./Player");
const DirectSession = require("../../lib/ptb/DirectSession");
const CodeBreakerController = require("../../lib/CodeBreakerController");

class World {
  constructor() {
    this._cast = {};
    this._controller = new CodeBreakerController();
  }

  findOrCreatePlayer(playerName) {
    if (this._cast[playerName]) return this._cast[playerName];

    const session = new DirectSession({ controller: this._controller });
    const player = new Player({ session });
    this._cast[playerName] = player;
    return player;
  }
}
setWorldConstructor(World);
