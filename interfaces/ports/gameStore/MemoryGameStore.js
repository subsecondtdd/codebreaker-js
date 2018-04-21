module.exports = class MemoryGameStore {
  constructor() {
    this._games = {};
    this._listeners = {};
  }

  async storeGame(game) {
    this._games[game.gameId] = game;
    const listeners = this._listeners[game.gameId] || [];
    for (let i = 0; i < listeners.length; i++) {
      await listeners[i].call(listeners[i]);
    }
  }

  async getGameById(gameId) {
    return this._games[gameId];
  }

  makeGameChangeEmitter({ gameId }) {
    return {
      addListener: listener => {
        this._listeners[gameId] = this._listeners[gameId] || [];
        this._listeners[gameId].push(listener);
      }
    };
  }
};
