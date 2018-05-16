const showGame = {nextQuery: {name: 'showGame', params: {}}}

module.exports = class CodeBreakerController {
  constructor() {
    this._pubSub = new PubSub()
  }

  startGame({secret}) {
    this._data = {
      wordLength: secret.length,
      gameState: 'Waiting for breaker',
      guessList: []
    }
    this._pubSub.publish()
    return showGame
  }

  joinGame() {
    this._pubSub.publish()
    return showGame
  }

  guess({guess}) {
    this._data.guessList.push({guess})
    this._data.gameState = 'Score guess'
    this._pubSub.publish()
    return showGame
  }

  score({points}) {
    this._data.guessList[this._data.guessList.length - 1].points = points
    this._pubSub.publish()
    return showGame
  }

  showGame() {
    const getData = () => Object.assign({}, this._data);

    return {
      data: getData(),
      subscribe: fn => this._pubSub.subscribe(() => fn({data: getData()}))
    };
  }
};


class PubSub {
  constructor() {
    this._callbacks = []
  }

  subscribe(callback) {
    this._callbacks.push(callback)
  }

  publish() {
    for (const callback of this._callbacks) {
      callback()
    }
  }
}
