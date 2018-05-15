module.exports = class Player {
  startGame({ secret }) {}

  joinGame() {}

  guess({ guess }) {}

  score({ points }) {}

  getGameState() {
    return "Score guess";
  }

  getGuessList() {
    return [{ points: 2 }];
  }
};
