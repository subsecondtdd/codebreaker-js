const { setWorldConstructor } = require("cucumber");
const Player = require("./Player");
const DirectSession = require("../../lib/ptb/DirectSession");

class World {
  findOrCreatePlayer(playerName) {
    const session = new DirectSession();
    return new Player({ session });
  }
}
setWorldConstructor(World);
