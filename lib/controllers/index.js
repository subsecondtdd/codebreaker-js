const controllerConstructors = [
  require("./GuessWordController"),
  require("./StartSessionController"),
  require("./JoinGameController"),
  require("./PlayAsBreakerController"),
  require("./PlayAsMakerController"),
  require("./ScoreLatestGuessController"),
  require("./StartGameController")
];

function buildControllerFactory(constructors) {
  return container =>
    class ControllerFactory {
      constructor() {
        this._controllers = constructors.map(Constructor =>
          container.instantiate(Constructor)
        );
      }

      findControllerWithAction(action) {
        const controllers = this._controllers.filter(
          controller => typeof controller[action] === "function"
        );
        if (controllers.length !== 1)
          throw new Error(
            `Expected 1 controller for ${action}, found ${controllers.length}`
          );
        return controllers[0];
      }
    };
}

exports.registerIn = container =>
  container.register({
    role: "controllers",
    Constructor: buildControllerFactory(controllerConstructors)(container)
  });
