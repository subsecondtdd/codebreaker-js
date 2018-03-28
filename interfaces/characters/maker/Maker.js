module.exports = class Maker {
  constructor({ waitingForMakerToStartGame }) {
    this.views = [waitingForMakerToStartGame];
  }

  async startGameWithWord({ word }) {
    this.views.push(await this.views[0].startGameWithWord({ word }));
  }

  getVisibleGameState() {
    return this.views[1].getVisibleGameState();
  }

  getOnlyGame() {
    return this.views[1].getGame();
  }
};
