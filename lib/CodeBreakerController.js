const showGame = {nextQuery: {name: 'showGame', params: {}}}

module.exports = class CodeBreakerController {
  constructor() {
    this._data = {
      gameState: 'unknown',
      guessList: []
    }
  }

  startGame({word}) {
    return showGame
  }

  joinGame() {
    return showGame
  }

  guess({guess}) {
    this._data.guessList.push({guess})
    this._data.gameState = 'Score guess'
    return showGame
  }

  score({points}) {
    this._data.guessList[this._data.guessList.length-1].points = points
    return showGame
  }

  showGame({}) {
    return {
      data: this._data
    };
  }
};
