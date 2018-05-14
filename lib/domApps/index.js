const PlayAsMakerApp = require("./PlayAsMakerApp");
const PlayAsBreakerApp = require("./PlayAsBreakerApp");

module.exports = class BrowserApps {
  constructor() {
    this._apps = {
      PlayAsMakerApp: new PlayAsMakerApp(),
      PlayAsBreakerApp: new PlayAsBreakerApp()
    };
  }

  mountAppInElement({ appName, element, stream }) {
    return this._apps[appName].mount({ element, stream });
  }
};
