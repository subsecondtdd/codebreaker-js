const { Before } = require("cucumber");

let nextGameId = 0;

class Game {
  constructor({ word }) {
    this.id = nextGameId++;
    this.word = word;
  }

  getStatus() {
    return "Waiting for breaker to join";
  }
}

class Maker {
  constructor({ gameStore }) {
    this._gameStore = gameStore;
    this.games = [];
  }

  startGameWithWord({ word }) {
    this.games.push(new Game({ word }));
  }

  sharesGameWith(breaker) {}
}
class Breaker {}

const roles = {
  Maker,
  Breaker
};

class Assembly {
  constructor() {
    this._gameStore = new GameStore();
    this._characters = {};
  }

  createCharacter({ roleName, name }) {
    let character = this._characters[name];
    if (!character) {
      character = new roles[roleName]({ gameStore: this._gameStore });
      this._characters[name] = character;
    }
    return character;
  }
}

class GameStore {
  storeGame(game) {}
}

Before(function() {
  this.assembly = new Assembly();
});
