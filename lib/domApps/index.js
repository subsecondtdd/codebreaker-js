const PlayAsMakerApp = require("./PlayAsMakerApp");
const PlayAsBreakerApp = require("./PlayAsBreakerApp");

class DomApps {
  constructor() {
    this._apps = {
      PlayAsMakerApp: new PlayAsMakerApp(),
      PlayAsBreakerApp: new PlayAsBreakerApp()
    };
  }

  mountAppInElement({ appName, element, stream }) {
    return this._apps[appName].mount({ element, stream });
  }
}

exports.registerIn = container =>
  container.register({
    role: "domApps",
    Constructor: DomApps,
    scope: "singleton"
  });
