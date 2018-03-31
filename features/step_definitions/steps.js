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

Given("{breaker} has made the first guess", async function(breaker) {
  const maker = await this.findOrCreateCharacter({
    roleName: "maker",
    characterName: "the Maker"
  });
  await maker.startGameWithWord({ word: "noise" });
  await breaker.joinGameStartedBy(maker);
  await breaker.guess({ word: "cameo" });
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

When("{maker} scores {int}", async function(maker, score) {
  await maker.score({ score });
});

Then("{maker} waits for a Breaker to join", function(maker) {
  assert.equal(maker.getGame().describeState(), "waiting for breaker to join");
});

Then("{breaker} sees the score {int}", function(breaker, points) {
  assert.equal(breaker.getGame().getLatestScore(), points);
});

Then("{breaker} must guess a word with {int} characters", function(
  breaker,
  wordLength
) {
  const game = breaker.getGame();
  assert.equal(game.describeState(), "waiting for breaker to guess");
  assert.equal(game.wordLength, wordLength);
});

Then("{maker} is asked to score", function(maker) {
  const game = maker.getGame();
  assert.equal(game.describeState(), "waiting for maker to score");
});
