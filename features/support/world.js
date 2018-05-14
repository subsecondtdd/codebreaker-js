const { setWorldConstructor } = require("cucumber");
const buildContainer = require("../../lib");

class World {
  constructor() {
    this._cast = {};
    this._container = buildContainer();
  }

  findOrCreateCharacter({ roleName, characterName }) {
    let character = this._cast[characterName];
    if (!character) {
      character = this._container.resolve(roleName);
      this._cast[characterName] = character;
    }
    return character;
  }
}

setWorldConstructor(World);
