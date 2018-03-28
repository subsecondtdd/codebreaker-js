const DomainWaitingForBreakerToGuess = require("../waitingForBreakerToGuess/DomainWaitingForBreakerToGuess");

module.exports = class DomainWaitingForInvitation {
  async joinGame({ game }) {
    game.join();
    return new DomainWaitingForBreakerToGuess({ game });
  }
};
