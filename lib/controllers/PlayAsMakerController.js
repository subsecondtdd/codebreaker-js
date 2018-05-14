module.exports = class PlayAsMakerController {
  constructor({ gameStore }) {
    this._gameStore = gameStore;
  }

  async playAsMaker({ gameId }) {
    const render = game => {
      const state = game.describeState();
      switch (state) {
        case "waiting for breaker to join":
          return {
            description: state,
            links: [{ action: "joinGame", params: { gameId: game.gameId } }]
          };
        case "waiting for maker to score guess":
          return {
            description: state,
            commands: [
              { action: "scoreLatestGuess", params: { gameId: game.gameId } }
            ]
          };
        case "waiting for breaker to guess word":
        case "game over":
          return {
            description: state
          };
        default:
          throw new Error(`Unexpected game state: ${state}`);
      }
    };
    return async listener => {
      await this._gameStore.watchGame(gameId, async game => {
        await listener(render(game));
      });
    };
  }
};
