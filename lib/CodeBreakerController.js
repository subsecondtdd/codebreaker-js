const showGame = {nextQuery: {name: 'showGame', params: {}}}

module.exports = class CodeBreakerController {
  startGame({word}) {
    return showGame
  }

  joinGame() {
    return showGame
  }

  guess({guess}) {
    return showGame
  }

  score({points}) {
    return showGame
  }

  showGame({}) {
    return {
      view: "showGame",
      data: {
        gameState: "Score guess",
        guessList: [{points: 2}]
      }
    };
  }
};
