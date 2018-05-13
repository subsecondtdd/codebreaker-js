const PlayAsMakerApp = require("./PlayAsMakerApp");

module.exports = class BrowserApps {
  constructor() {
    this._apps = {
      PlayAsMakerApp: new PlayAsMakerApp()
    };
  }

  mountAppInElement({ appName, element, stream }) {
    return this._apps[appName].mount({ element, stream });
  }
};
