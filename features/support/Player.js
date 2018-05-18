module.exports = class Player {
  constructor({ session }) {
    this._session = session;
    this._version = 0
  }

  async startGame({ secret }) {
    await this._session.dispatchCommand({ name: "startGame", params: { secret } });
  }

  async joinGame() {
    await this._session.dispatchCommand({ name: "joinGame", params: {} });
  }

  async guess({ guess }) {
    await this._session.dispatchCommand({ name: "guess", params: { guess } });
  }

  async score({ points }) {
    await this._session.dispatchCommand({ name: "score", params: { points } });
  }

  async scoreCorrect() {
    await this._session.dispatchCommand({ name: "scoreCorrect", params: {} });
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
