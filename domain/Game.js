module.exports = class Game {
  constructor({ gameId }) {
    this.gameId = gameId;
    this.guesses = [];
    this.wordLength = 5;
    this.breakerJoined = false;
  }

  join() {
    this.breakerJoined = true;
  }

  guessWord({ guess }) {
    this.guesses.push({ guess, points: null, correct: null });
  }

  scoreLatestGuess(points) {
    const latestGuess = this.guesses[this.guesses.length - 1];
    latestGuess.points = points;
  }

  describeState() {
    if (!this.breakerJoined) {
      return "waiting for breaker to join";
    }
    const latestGuess = this.guesses[this.guesses.length - 1];
    if (latestGuess && latestGuess.points === null) {
      return "waiting for maker to score guess";
    }
    return "waiting for breaker to guess word";
  }
};
