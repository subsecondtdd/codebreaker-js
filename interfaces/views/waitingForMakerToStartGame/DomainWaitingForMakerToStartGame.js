const Game = require("../../../domain/Game");
const DomainWaitingForBreakerToJoin = require("../waitingForBreakerToJoin/DomainWaitingForBreakerToJoin");

module.exports = class DomainWaitingForMakerToStartGame {
  constructor({ gameStore }) {
    this.gameStore = gameStore;
  }

  async startGameWithWord({ word }) {
    const game = new Game({ word });
    await this.gameStore.storeGame(game);
    return new DomainWaitingForBreakerToJoin({ game });
  }
};
