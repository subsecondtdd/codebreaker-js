module.exports = class PlayAsBreakerController {
  async playAsBreaker({ game }) {
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
  }
};
