module.exports = class Player {
  constructor({ session }) {
    this._session = session;
  }

  startGame({ secret }) {
    return this._session.dispatchCommand({ name: "startGame", params: { secret } });
  }

  joinGame() {
    return this._session.dispatchCommand({ name: "joinGame", params: {} });
  }

  guess({ guess }) {
    return this._session.dispatchCommand({ name: "guess", params: { guess } });
  }

  score({ points }) {
    return this._session.dispatchCommand({ name: "score", params: { points } });
  }

  scoreCorrect() {
    return this._session.dispatchCommand({ name: "scoreCorrect", params: {} });
  }

  getGameState() {
    return this._session.getTestView("gameState");
  }

  getWordLength() {
    return this._session.getTestView("wordLength");
  }

  getGuessList() {
    return this._session.getTestView("guessList");
  }

  getErrorMessage() {
    return this._session.getTestView("errorMessage");
  }
};
