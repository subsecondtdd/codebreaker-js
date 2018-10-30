const Fetch22 = require('fetch-22')

module.exports = class HttpCodebreaker {
  constructor(baseUrl, fetch) {
    this._fetch22 = new Fetch22({baseUrl, fetch})
  }

  async getGames() {
    return this._fetch22.get('/api/games')
  }

  async createGame(makerName, secret) {
    await this._fetch22.post(`/api/games`, {makerName, secret})
  }

  async startGame(gameId, makerName) {
    await this._fetch22.post(`/api/games/${encodeURIComponent(gameId)}/maker`, {makerName})
  }
}
