module.exports = class Breaker {
  constructor({ waitingForInvitation }) {
    this.views = [waitingForInvitation];
  }

  async joinGameStartedBy(maker) {
    const game = maker.getLatestGame();
    this.views.push(await this.views[0].joinGame({ game }));
  }

  getVisibleGameState() {
    return this.views[1].getVisibleGameState();
  }
};
