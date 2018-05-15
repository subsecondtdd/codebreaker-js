module.exports = class CodeBreakerController {
  startGame({ word }) {
    return {
      view: "showGame",
      data: {
        gameState: "Score guess",
        guessList: [{ points: 2 }]
      }
    };
  }

  joinGame() {
    return {
      view: "showGame",
      data: {
        gameState: "Score guess",
        guessList: [{ points: 2 }]
      }
    };
  }

  guess({ guess }) {
    return {
      view: "showGame",
      data: {
        gameState: "Score guess",
        guessList: [{ points: 2 }]
      }
    };
  }

  score({ points }) {
    return {
      view: "showGame",
      data: {
        gameState: "Score guess",
        guessList: [{ points: 2 }]
      }
    };
  }
};
