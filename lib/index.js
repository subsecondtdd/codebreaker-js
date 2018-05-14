const Assembly = require("./assembly");
const Container = require("./container");
const characters = require("./characters");
const controllers = require("./controllers");
const domApps = require("./domApps");
const ports = require("./ports");
const sessions = require("./sessions");
const web = require("./web");

module.exports = function buildContainer() {
  const container = new Container(new Assembly());
  characters.registerIn(container);
  controllers.registerIn(container);
  domApps.registerIn(container);
  ports.registerIn(container);
  sessions.registerIn(container);
  web.registerIn(container);
  return container;
};
