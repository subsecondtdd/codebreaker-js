module.exports = class Breaker {
  async joinGameStartedBy(maker) {
    this.game = maker.getGame();
    this.game.join();
  }

  async guess({ word }) {
    await this.game.guess({ word });
  }

  getGame() {
    return this.game;
  }
};
