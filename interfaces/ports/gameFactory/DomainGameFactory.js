const Game = require("../../../domain/Game");

module.exports = class DomainGameFactory {
  createGame({ word }) {
    return new Game({ word });
  }
};
