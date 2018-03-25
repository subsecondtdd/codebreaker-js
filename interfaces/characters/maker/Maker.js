module.exports = class Maker {
  constructor({ waitingForMaker }) {
    this.views = [waitingForMaker];
  }

  async startGameWithWord({ word }) {
    this.views.push(await this.views[0].startGameWithWord({ word }));
  }

  getVisibleGameState() {
    return this.views[1].getVisibleGameState();
  }
};
