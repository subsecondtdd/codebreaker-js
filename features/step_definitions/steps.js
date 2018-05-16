const assert = require("assert");
const { Given, When, Then } = require("cucumber");

Given("{player} has joined {player}'s game", function(breaker, maker) {
  maker.startGame({ secret: "steak" });
  breaker.joinGame();
});

Given("{player} has made the first guess in {player}'s game", function(
  breaker,
  maker
) {
  maker.startGame({ secret: "magic" });
  breaker.joinGame();
  breaker.guess({ guess: "limbo" });
});

When('{player} starts a game', function (maker) {
  maker.startGame({ secret: "stake" });
})

When("{player} scores {int}", function(maker, points) {
  maker.score({ points });
});

When("{player} makes a guess", function(breaker) {
  breaker.guess({ guess: "spice" });
});

Then('{player} waits for a Breaker to join', function (maker) {
  const gameState = maker.getGameState();
  assert.equal(gameState, "Waiting for breaker");
})

Then("{player} is asked to score the guess", function(maker) {
  const gameState = maker.getGameState();
  assert.equal(gameState, "Score guess");
});

Then("{player} sees the score {int}", function(player, points) {
  const guessList = player.getGuessList();
  assert.equal(guessList[guessList.length - 1].points, points);
});
