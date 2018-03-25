const { Given, When, Then } = require("cucumber");
const assert = require("assert");

When("{maker} starts a game", async function(maker) {
  await maker.startGameWithWord({ word: "whale" });
});

Then("{maker} waits for a Breaker to join", function(maker) {
  assert.equal(maker.getVisibleGameState(), "waiting-for-breaker-to-join");
});
