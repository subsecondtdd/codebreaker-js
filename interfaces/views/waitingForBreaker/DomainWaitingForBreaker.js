module.exports = class DomainWaitingForBreaker {
  constructor({ game }) {
    this.game = game;
  }

  getVisibleGameState() {
    return "waiting-for-breaker-to-join";
  }
};
