const {setWorldConstructor} = require('cucumber')
const Player = require('./Player')

class World {
  findOrCreatePlayer(playerName) {
    return new Player()
  }
}
setWorldConstructor(World)
