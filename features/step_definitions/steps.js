const assert = require('assert')
const {Given, When, Then} = require('cucumber')

Given('{player} has joined {player}\'s game', function (breaker, maker) {
  maker.startGame({secret: 'steak'})
  breaker.joinGame()
})

When('{player} makes a guess', function (breaker) {
  breaker.guess({guess: 'spice'})
})

Then('{player} is asked to score the guess', function (maker) {
  const gameState = maker.getGameState()
  assert.equal(gameState, 'Score guess')
})