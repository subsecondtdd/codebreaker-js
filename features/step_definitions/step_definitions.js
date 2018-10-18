const assert = require('assert')
const {Given, When, Then} = require('cucumber')

Given('{actor} has started a game with the word {string}', async function (maker, secret) {
  const makerName = maker.getName()
  // Given steps set up state without interacting with actors (getting the actor's name is ok though)
  await this._codebreaker.createGame(makerName, secret)
})

When('{actor} joins {actor}\'s game', async function (breaker, maker) {
  await this.synchronized() // Wait for all agents to have the same version
  await breaker.joinGameCreatedBy(maker.getName())
})

Then('{actor} must guess a word with {int} letters', async function (breaker, expectedLetterCount) {
  // actualLetterCount is a "test view" (in this case, an integer)
  const actualLetterCount = breaker.getCurrentGameLetterCount()
  assert.equal(actualLetterCount, expectedLetterCount)
})
