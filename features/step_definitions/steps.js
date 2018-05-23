const assert = require("assert");
const { Given, When, Then } = require("cucumber");

Given("{player} has joined {player}'s game", async function(breaker, maker) {
  await maker.startGame({ secret: "steak" });
  await maker.waitFor({ gameVersion: 0 })
  await breaker.joinGame();
  await this.castHas({ gameVersion: 1 })
});

Given('{player} has started a game with the word {string}', async function (maker, secret) {
  await maker.startGame({ secret });
  await maker.waitFor({ gameVersion: 0 })
})

Given("{player} has made the first guess in {player}'s game", async function(
  breaker,
  maker
) {
  await maker.startGame({ secret: "magic" });
  await maker.waitFor({ gameVersion: 0 })
  await breaker.joinGame();
  await this.castHas({ gameVersion: 1 })
  await breaker.guess({ guess: "limbo" });
  await this.castHas({ gameVersion: 2 })
});

Given('{player} has guessed {string}', async function (breaker, guess) {
  const gameVersion = breaker.getGameVersion()
  await breaker.guess({ guess });
  await this.castHas({ gameVersion: gameVersion + 1 })
})

When('{player} starts a game', async function (maker) {
  await maker.startGame({ secret: "stake" });
  await this.castHas({ gameVersion: 0 })
})

When('{player} joins {player}\'s game', async function (breaker, maker) {
  await breaker.joinGame();
  await this.castHas({ gameVersion: 1 })
})

When("{player} scores {int}", async function(maker, points) {
  const gameVersion = maker.getGameVersion()
  await maker.score({ points });
  await this.castHas({ gameVersion: gameVersion + 1 })
});

When('{player} scores the guess as correct', async function (maker) {
  const gameVersion = maker.getGameVersion()
  await maker.scoreCorrect();
  await this.castHas({ gameVersion: gameVersion + 1 })
})

When("{player} makes a guess", async function(breaker) {
  const gameVersion = breaker.getGameVersion()
  await breaker.guess({ guess: "spice" });
  await this.castHas({ gameVersion: gameVersion + 1 })
});

When('{player} guesses {string}', async function (breaker, guess) {
  const gameVersion = breaker.getGameVersion()
  await breaker.guess({ guess });
  await this.castHas({ gameVersion: gameVersion + 1 })
})

When('{player} guesses incorrect length {string}', async function (breaker, guess) {
  await breaker.guess({ guess });
  // TODO wait for error
  await new Promise(resolve => setTimeout(resolve , 10))
})

Then('{player} waits for a Breaker to join', function (maker) {
  const gameState = maker.getGameState();
  assert.equal(gameState, "Waiting for breaker");
})

Then('{player} must guess a word with {int} letters', function (breaker, wordLength) {
  assert.equal(breaker.getWordLength(), wordLength);
})

Then('{player} is told {string}', function (player, errorMessage) {
  assert.equal(player.getErrorMessage(), errorMessage);
})

Then("{player} is asked to score the guess", function(maker) {
  const gameState = maker.getGameState();
  assert.equal(gameState, "Waiting for score");
});

Then("{player} sees the score {int}", function(player, points) {
  const guessList = player.getGuessList();
  assert.equal(guessList[guessList.length - 1].points, points);
});

Then('{player}\'s guess is not submitted', function (player) {
  const guessList = player.getGuessList();
  assert.deepEqual(guessList, []);
})

Then('{player} sees that the game is over', function (breaker) {
  const gameState = breaker.getGameState();
  assert.equal(gameState, "Game over");
})
