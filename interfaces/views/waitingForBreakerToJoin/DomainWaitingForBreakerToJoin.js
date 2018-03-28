module.exports = class DomainWaitingForBreakerToJoin {
  constructor({ game }) {
    this.game = game;
  }

  getVisibleGameState() {
    return "waiting-for-breaker-to-join";
  }

  getGame() {
    return this.game;
  }
};
