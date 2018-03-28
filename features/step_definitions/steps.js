const { Given, When, Then } = require("cucumber");
const assert = require("assert");

Given("{maker} has started a game with the word {string}", async function(
  maker,
  word
) {
  await maker.startGameWithWord({ word });
});

When("{maker} starts a game", async function(maker) {
  await maker.startGameWithWord({ word: "whale" });
});

When("{breaker} joins {maker}'s game", async function(breaker, maker) {
  await breaker.joinGameStartedBy(maker);
});

Then("{maker} waits for a Breaker to join", function(maker) {
  assert.equal(maker.getVisibleGameState(), "waiting-for-breaker-to-join");
});

Then("{breaker} must guess a word with {int} characters", function(
  breaker,
  expectedWordLength
) {
  const { name, wordLength } = breaker.getVisibleGameState();
  assert.equal(name, "waiting-for-breaker-to-guess");
  assert.equal(wordLength, expectedWordLength);
});
