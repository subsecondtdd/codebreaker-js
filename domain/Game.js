module.exports = class Game {
  constructor() {
    this.wordLength = 5;
    this.state = "waiting for breaker to join";
    this.guesses = [];
  }

  join() {
    this.state = "waiting for breaker to guess";
  }

  guess({ word }) {
    this.state = "waiting for maker to score";
    this.guesses.push({ word });
  }

  score({ score }) {
    this.guesses[this.guesses.length - 1].score = score;
  }

  getLatestScore() {
    return this.guesses[this.guesses.length - 1].score;
  }

  describeState() {
    return this.state;
  }
};
