const DomainWaitingForBreakerToGuess = require("../waitingForBreakerToGuess/DomainWaitingForBreakerToGuess");

module.exports = class DomainWaitingForInvitation {
  async joinGame({ game }) {
    return new DomainWaitingForBreakerToGuess({ game });
  }
};
