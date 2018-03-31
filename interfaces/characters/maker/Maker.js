module.exports = class Maker {
  constructor({ gameFactory }) {
    this.gameFactory = gameFactory;
  }

  async startGameWithWord({ word }) {
    this.game = this.gameFactory.createGame({ word });
  }

  async score({ score }) {
    await this.game.score({ score });
  }

  getGame() {
    return this.game;
  }
};
