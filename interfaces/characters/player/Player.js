module.exports = class Player {
  constructor({ browser }) {
    this._browser = browser;
  }

  async startSession() {
    await this._browser.startSession();
  }

  async startGameWithWord({ word }) {
    await this._browser.submitForm({
      action: "startGameWithWord",
      params: { word }
    });
  }

  async joinGameStartedBy(maker) {
    await this._browser.openLink(maker.getVisibleLink({ action: "joinGame" }));
  }

  async guessWord(params) {
    await this._browser.submitForm({
      action: "guessWord",
      params
    });
  }

  async scoreLatestGuess(params) {
    await this._browser.submitForm({
      action: "scoreLatestGuess",
      params
    });
  }

  describeView() {
    return this._browser.describeView();
  }

  getVisibleLink({ action }) {
    return this._browser.getVisibleLink({ action });
  }

  getVisibleData(key) {
    return this._browser.getVisibleData(key);
  }
};
