const { Given, When, Then } = require("cucumber");
const assert = require("assert");

Given("{Maker} has started a game with the word {string}", async function(
  maker,
  word
) {
  return maker.startGameWithWord({ word });
});

When("{Maker} starts a game", async function(maker) {
  // maker.games == []
  await maker.startGameWithWord({ word: "whale" }); // maker.games == [{...}]
  // await maker.startGameWithWord({ word: "whale" }); // maker.games == [{...}, {...}]
});

When("{Breaker} joins {Maker}'s game", async function(breaker, maker) {
  await maker.sharesGameWith(breaker); // maker.games must have exactly one item
});

Then("{Maker} waits for a Breaker to join", function(maker) {
  assert.equal(maker.games[0].getStatus(), "Waiting for breaker to join");
});

Then("{Breaker} must guess a word with {int} characters", function(
  Breaker,
  int,
  callback
) {
  // Write code here that turns the phrase above into concrete actions
  callback(null, "pending");
});
//
// Then("{Breaker} must guess a word with {int} characters", function(
//   breaker,
//   expectedWordLength
// ) {
//   assert.equal(breaker.uiQueries.gameWordLength(), expectedWordLength);
// });
