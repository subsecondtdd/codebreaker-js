const Game = require("../domain/Game");

module.exports = class StartGameController {
  constructor({ idGenerator, gameStore }) {
    this._idGenerator = idGenerator;
    this._gameStore = gameStore;
  }

  async startGameWithWord({ word }) {
    const gameId = await this._idGenerator.generateId("game");
    const game = new Game({ gameId });
    await this._gameStore.storeGame(game);
    return {
      redirectTo: {
        action: "playAsMaker",
        params: { gameId }
      }
    };
  }
};
