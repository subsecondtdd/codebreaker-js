const assert = require('assert')
const {Given, When, Then} = require('cucumber')

Given('{actor} has started a game with the secret {string}', async function (maker, secret) {
  // Given steps set up state without interacting with actors
  // (getting the actor's name is ok though)
  await this._codebreaker.createGame(maker.getName(), secret)
})

When('{actor} creates a game with the secret {string}', async function (maker, secret) {
  // Synchronize the state between all actors
  await this.synchronized()
  await maker.createGame(secret)
})

When('{actor} joins {actor}\'s game', async function (breaker, maker) {
  await this.synchronized() // Wait for all agents to have the same version
  await breaker.joinGameCreatedBy(maker.getName())
})

Then('{actor} can see a game with {int} letters', async function (breaker, expectedLetterCount) {
  await this.synchronized()
  const games = await breaker.getGames()
  const game = games.find(game => game.letterCount === expectedLetterCount)
  assert.ok(game)
})

Then('{actor} must guess a word with {int} letters', async function (breaker, expectedLetterCount) {
  await this.synchronized()
  // actualLetterCount is a "test view" (in this case, an integer)
  const actualLetterCount = await breaker.getCurrentGameLetterCount()
  assert.equal(actualLetterCount, expectedLetterCount)
})
