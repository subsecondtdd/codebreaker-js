module.exports = class DirectSession {
  constructor() {
    this._result = {
      gameState: "Score guess",
      guessList: [{ points: 2 }]
    };
  }

  getTestView(name) {
    return this._result[name];
  }
};
