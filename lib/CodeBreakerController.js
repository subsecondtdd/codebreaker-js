module.exports = class CodeBreakerController {
  startGame({ word }) {
  }

  joinGame() {
  }

  guess({ guess }) {
  }

  score({ points }) {
  }

  showGame({}) {
    return {
      view: "showGame",
      data: {
        gameState: "Score guess",
        guessList: [{ points: 2 }]
      }
    };
  }
};
