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

  scoreLatestGuess({ points, correct }) {
    const latestGuess = this.guesses[this.guesses.length - 1];
    latestGuess.points = points;
    latestGuess.correct = correct;
  }

  describeState() {
    if (!this.breakerJoined) {
      return "waiting for breaker to join";
    }
    const latestGuess = this.guesses[this.guesses.length - 1];
    if (latestGuess) {
      if (latestGuess.correct) return "game over";
      if (latestGuess.points === null)
        return "waiting for maker to score guess";
    }
    return "waiting for breaker to guess word";
  }
};
