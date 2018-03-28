module.exports = class Game {
  constructor() {
    this.wordLength = 5;
    this.state = "waiting for breaker to join";
  }

  join() {
    this.state = "waiting for breaker to guess";
  }

  guess({ word }) {
    this.state = "waiting for maker to score";
  }

  describeState() {
    return this.state;
  }
};
