module.exports = buildControllerFactory([
  require("./GuessWordController"),
  require("./HomeController"),
  require("./JoinGameController"),
  require("./PlayAsBreakerController"),
  require("./PlayAsMakerController"),
  require("./ScoreLatestGuessController"),
  require("./StartGameController")
]);

function buildControllerFactory(constructors) {
  return container =>
    class ControllerFactory {
      constructor() {
        this._controllers = constructors.map(Constructor =>
          container.instantiate(Constructor)
        );
      }

      findControllerWithAction(action) {
        return this._controllers.find(
          controller => typeof controller[action] === "function"
        );
      }
    };
}
