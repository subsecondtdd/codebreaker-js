module.exports = class PlayAsMakerController {
  playAsMaker({ game }) {
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
          forms: [
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
  }
};
