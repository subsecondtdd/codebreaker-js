// TODO: remove this and collapse with Session?
module.exports = class Player {
  constructor({ session }) {
    this._session = session;
  }

  async startSession() {
    await this._session.startSession();
  }

  async startGameWithWord({ word }) {
    await this._session.dispatchCommand({
      action: "startGameWithWord",
      params: { word }
    });
  }

  async joinGameStartedBy(maker) {
    await this._session.openLink(maker.getVisibleLink({ action: "joinGame" }));
  }

  async guessWord(params) {
    await this._session.dispatchCommand({
      action: "guessWord",
      params
    });
  }

  async scoreLatestGuess(params) {
    await this._session.dispatchCommand({
      action: "scoreLatestGuess",
      params
    });
  }

  describeView() {
    return this._session.describeView();
  }

  getVisibleLink({ action }) {
    return this._session.getVisibleLink({ action });
  }

  getVisibleData(key) {
    return this._session.getVisibleData(key);
  }
};
