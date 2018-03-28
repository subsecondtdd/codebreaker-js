module.exports = class Breaker {
  constructor({ waitingForInvitation }) {
    this.views = [waitingForInvitation];
  }

  async joinGameStartedBy(maker) {
    const game = maker.getOnlyGame();
    this.views.push(await this.views[0].joinGame({ game }));
  }

  async guess({ word }) {
    await this.views[1].guess({ word });
  }

  getOnlyGame() {
    return this.views[1].getGame();
  }
};
