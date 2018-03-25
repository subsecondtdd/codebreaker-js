const Game = require("../../../domain/Game");
const DomainWaitingForBreaker = require("../waitingForBreaker/DomainWaitingForBreaker");

module.exports = class DomainWaitingForMaker {
  constructor({ gameStore }) {
    this.gameStore = gameStore;
  }

  async startGameWithWord({ word }) {
    const game = new Game({ word });
    await this.gameStore.storeGame(game);
    return new DomainWaitingForBreaker({ game });
  }
};
