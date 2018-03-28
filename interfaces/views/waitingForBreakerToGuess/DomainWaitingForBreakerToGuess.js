module.exports = class DomainWaitingForBreakerToGuess {
  constructor({ game }) {
    this.game = game;
  }

  async guess({ word }) {
    this.game.guess({ word });
  }

  getGame() {
    return this.game;
  }
};
