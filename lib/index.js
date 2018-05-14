const Assembly = require("./assembly");
const Container = require("./container");
const characters = require("./characters");
const ports = require("./ports");
const controllers = require("./controllers");
const sessions = require("./sessions");
const web = require("./web");
const domApps = require("./domApps");

module.exports = function buildContainer() {
  const container = new Container(new Assembly());
  characters.registerIn(container);
  ports.registerIn(container);
  web.registerIn(container);
  sessions.registerIn(container);
  domApps.registerIn(container);
  controllers.registerIn(container);
  return container;
};
