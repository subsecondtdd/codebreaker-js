const assert = require('assert')
const {MemoryPubSub} = require('pubsub-multi')
const Codebreaker = require('../domain/Codebreaker')
const ActiveState = require('./ActiveState')

describe('ActiveState', () => {
  it.only("observes the game list", async () => {
    const pubSub = new MemoryPubSub()
    const codebreaker = new Codebreaker(pubSub)
    const activeState = new ActiveState(pubSub)

    await codebreaker.createGame("maker", "silky")

    await activeState.start()
    let state = null
    await activeState.observe(
      'gameList',
      () => codebreaker.getGames(),
      _state => state = _state
    )

    // Wait for version to sync
    const version = codebreaker.getVersion()
    await new Promise((resolve, reject) => {
      activeState.observe(
        'gameList',
        () => codebreaker.getGames(),
        _state => {
          if (_state.version === version) {
            resolve()
          }
        }
      ).catch(reject)
    })

    assert.deepStrictEqual(state, {
      version: 1,
      games: [{maker: 'maker', letterCount: 5}]
    })
  })

  it("updates the list of games when the central list is updated", async () => {
    const pubSub = new MemoryPubSub()
    const codebreaker = new Codebreaker(pubSub)
    const codebreakerState = new ActiveState(codebreaker, pubSub)

    let state = null
    await codebreakerState.start((_state) => state = _state)

    await codebreaker.createGame("maker", "silky")
    await codebreakerState.hasVersion(codebreaker.getVersion())

    assert.deepStrictEqual(state, {games: [{maker: 'maker', letterCount: 5}]})
  })

  it("updates breaker's state when they join a game", async () => {
    const pubSub = new MemoryPubSub()
    const codebreaker = new Codebreaker(pubSub)
    const codebreakerState = new ActiveState(codebreaker, pubSub)

    let state = null
    await codebreakerState.start((_state) => state = _state)

    await codebreaker.createGame("maker", "silky")
    await codebreaker.startGame("breaker", "maker")
    await codebreakerState.hasVersion(codebreaker.getVersion())

    assert.deepStrictEqual(state, {games: [{maker: 'maker', letterCount: 5}]})
  })
})
