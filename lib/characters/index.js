const Player = require("./Player");

exports.registerIn = container => {
  container.register({
    role: "player",
    Constructor: Player
  });
};
