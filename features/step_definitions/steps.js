const { Given, When, Then } = require("cucumber");
const assert = require("assert");

Given(
  "{player} has started a game with the word {string}",
  async function makerHasStartedGameWithWord(maker, word) {
    await maker.openApplication();
    await maker.startGameWithWord({ word });
  }
);

Given(
  "{player} has joined a game started with the word {string}",
  async function breakerHasJoinedGameStartedWithWord(breaker, word) {
    const maker = await this.findOrCreateCharacter({
      roleName: "player",
      characterName: "the Maker"
    });
    await maker.openApplication();
    await maker.startGameWithWord({ word });
    await breaker.joinGameStartedBy(maker);
  }
);

Given(
  "{player} has joined {player}'s game",
  async function breakerHasJoinedMakersGame(breaker, maker) {
    await maker.openApplication();
    await maker.startGameWithWord({ word: "bingo" });
    await breaker.joinGameStartedBy(maker);
  }
);

Given(
  "{player} has made the first guess",
  async function breakerHasMadeFirstGuess(breaker) {
    const maker = await this.findOrCreateCharacter({
      roleName: "player",
      characterName: "the Maker"
    });
    await maker.openApplication();
    await maker.startGameWithWord({ word: "noise" });
    await breaker.joinGameStartedBy(maker);
    await breaker.guessWord({ guess: "cameo" });
  }
);

When("{player} starts a game", async function makerStartsGame(maker) {
  await maker.openApplication();
  await maker.startGameWithWord({ word: "bingo" });
});

When("{player} joins {player}'s game", async function breakerJoinsMakersGame(
  breaker,
  maker
) {
  await breaker.joinGameStartedBy(maker);
});

When("{player} guesses {string}", async function breakerGuessesWordWithGuess(
  breaker,
  guess
) {
  await breaker.guessWord({ guess });
});

When("{player} makes a guess", async function breakerGuessesWord(breaker) {
  await breaker.guessWord({ guess: "bonus" });
});

When("{player} scores {int}", async function makerScores(maker, points) {
  await maker.scoreLatestGuess({ points });
});

Then(
  "{player} waits for a Breaker to join",
  function makerWaitsForBreakerToJoin(maker) {
    assert.equal(maker.describeView(), "waiting for breaker to join");
  }
);

Then("{player} sees the score {int}", function breakerSeesTheScore(
  breaker,
  points
) {
  assert.equal(breaker.describeView(), "waiting for breaker to guess word");
  const guesses = breaker.getVisibleData("guesses");
  assert.equal(guesses[guesses.length - 1].points, points);
});

Then(
  "{player} must guess a word with {int} characters",
  function breakerMustGuessWordWithLength(breaker, wordLength) {
    assert.equal(breaker.describeView(), "waiting for breaker to guess word");
    assert.equal(breaker.getVisibleData("wordLength"), wordLength);
  }
);

Then("{player} is asked to score", function makerIsAskedToScore(maker) {
  assert.equal(maker.describeView(), "waiting for maker to score guess");
});

Then("{player}'s guess is not submitted", function breakersGuessIsNotSubmitted(
  breaker
) {
  assert.equal(breaker.describeView(), "guess not submitted");
});

Then("{player}'s guess is submitted", function breakersGuessIsSubmitted(
  breaker
) {
  assert.equal(breaker.describeView(), "guess submitted");
});

Then("{player} sees that the game is over", function breakerSeesGameOver(
  breaker
) {
  assert.equal(breaker.describeView(), "game over");
});

Then("{player} sees that the game is not over", function breakerSeesGameNotOver(
  breaker
) {
  assert.equal(breaker.describeView(), "awaiting score");
});
