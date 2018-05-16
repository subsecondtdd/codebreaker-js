module.exports = class Player {
  constructor({ session }) {
    this._session = session;
  }

  startGame({ secret }) {
    this._session.dispatchCommand({ name: "startGame", params: { secret } });
  }

  joinGame() {
    this._session.dispatchCommand({ name: "joinGame", params: {} });
  }

  guess({ guess }) {
    this._session.dispatchCommand({ name: "guess", params: { guess } });
  }

  score({ points }) {
    this._session.dispatchCommand({ name: "score", params: { points } });
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
