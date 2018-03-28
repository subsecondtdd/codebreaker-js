const { Given, When, Then } = require("cucumber");
const assert = require("assert");

Given("{maker} has started a game with the word {string}", async function(
  maker,
  word
) {
  await maker.startGameWithWord({ word });
});

Given("{breaker} has joined {maker}'s game", async function(breaker, maker) {
  await maker.startGameWithWord({ word: "bingo" });
  await breaker.joinGameStartedBy(maker);
});

When("{maker} starts a game", async function(maker) {
  await maker.startGameWithWord({ word: "whale" });
});

When("{breaker} joins {maker}'s game", async function(breaker, maker) {
  await breaker.joinGameStartedBy(maker);
});

When("{breaker} makes a guess", async function(breaker) {
  await breaker.guess({ word: "bonus" });
});

Then("{maker} waits for a Breaker to join", function(maker) {
  const game = maker.getOnlyGame();
  assert.equal(game.describeState(), "waiting for breaker to join");
});

Then("{breaker} must guess a word with {int} characters", function(
  breaker,
  wordLength
) {
  const game = breaker.getOnlyGame();
  assert.equal(game.describeState(), "waiting for breaker to guess");
  assert.equal(game.wordLength, wordLength);
});

Then("{maker} is asked to score", function(maker) {
  const game = maker.getOnlyGame();
  assert.equal(game.describeState(), "waiting for maker to score");
});
