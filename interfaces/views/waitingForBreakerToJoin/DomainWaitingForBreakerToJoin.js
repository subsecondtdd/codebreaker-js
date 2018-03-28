module.exports = class DomainWaitingForBreakerToJoin {
  constructor({ game }) {
    this.game = game;
  }

  getGame() {
    return this.game;
  }
};
