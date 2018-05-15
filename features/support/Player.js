module.exports = class Player {
  constructor({ session }) {
    this._session = session;
  }

  startGame({ secret }) {}

  joinGame() {}

  guess({ guess }) {}

  score({ points }) {}

  getGameState() {
    return this._session.getTestView("gameState");
  }

  getGuessList() {
    return this._session.getTestView("guessList");
  }
};
