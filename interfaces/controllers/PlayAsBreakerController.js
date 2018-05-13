module.exports = class PlayAsBreakerController {
  constructor({ gameStore }) {
    this._gameStore = gameStore;
  }

  async playAsBreaker({ gameId }) {
    const render = game => {
      const state = game.describeState();
      return {
        description: state,
        commands:
          state === "waiting for breaker to guess word"
            ? [
                {
                  action: "guessWord",
                  params: { gameId: game.gameId }
                }
              ]
            : [],
        data: { wordLength: game.wordLength, guesses: game.guesses }
      };
    };
    return async listener => {
      await this._gameStore.watchGame(gameId, async game => {
        await listener(render(game));
      });
    };
  }
};
