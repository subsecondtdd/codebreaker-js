const assert = require('assert')
const {MemoryPubSub} = require('pubsub-multi')
const Codebreaker = require('./Codebreaker')

describe('Codebreaker', () => {
  let codebreaker = null
  let sub = null
  let v0 = null

  beforeEach(async () => {
    const pubSub = new MemoryPubSub()
    codebreaker = new Codebreaker(pubSub)
    v0 = codebreaker.getVersion()
    sub = await pubSub.makeSubscriber()
  })

  it("keeps a list of games", async () => {
    await codebreaker.createGame('Maker', 'steak')
    const games = codebreaker.getGames()
    assert.ok(games[0].id)
    delete games[0].id // Don't care about this
    assert.deepStrictEqual(games, [{
      makerName: 'Maker',
      breakerName: null,
      letterCount: 5,
    }])
  })

  it("can start a game", async () => {
    await codebreaker.createGame('Maker', 'steak')
    const games = codebreaker.getGames()
    await codebreaker.startGame(games[0].id, 'Breaker')
    const game = codebreaker.getGame(games[0].id)
    delete game.id

    assert.deepStrictEqual(game, {
      makerName: 'Maker',
      breakerName: 'Breaker',
      letterCount: 5,
    })
  })

  describe("versioning", () => {
    it("increments version when a game is created", async () => {
      await new Promise(resolve => {
        sub.subscribe('version', () => {
          const v = codebreaker.getVersion()
          if (v === v0 + 1) resolve()
        })
        codebreaker.createGame('Maker', 'steak')
      })
    })

    it("increments version when a game is started", async () => {
      const v0 = codebreaker.getVersion()
      await codebreaker.createGame('Maker', 'steak')
      const games = codebreaker.getGames()
      await new Promise(resolve => {
        sub.subscribe('version', () => {
          const v = codebreaker.getVersion()
          if (v === v0 + 2) resolve()
        })
        codebreaker.startGame(games[0].id, 'Breaker')
      })
    })
  })
})
