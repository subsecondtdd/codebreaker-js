const Fetch22 = require('fetch-22')

/**
 * Client-side controller. Translates commands to HTTP requests.
 * Handles server-sent events for push updates.
 */
module.exports = class HttpCodebreaker {
  constructor(baseUrl, fetch) {
    this._fetch22 = new Fetch22({baseUrl, fetch})
  }

  async getGames() {
    return this._fetch22.get('/api/games')
  }

  async startGame(gameId, makerName) {
    await this._fetch22.post(`/api/games/${encodeURIComponent(gameId)}/maker`, {makerName})
  }
}
