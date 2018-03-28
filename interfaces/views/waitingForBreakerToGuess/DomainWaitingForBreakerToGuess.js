module.exports = class DomainWaitingForBreakerToGuess {
  constructor({ game }) {
    this.game = game;
  }

  getVisibleGameState() {
    return {
      name: "waiting-for-breaker-to-guess",
      wordLength: this.game.wordLength
    };
  }
};
