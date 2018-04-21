// This is the START state
module.exports = class HomeController {
  openApplication() {
    return {
      description: "home",
      commands: [{ action: "startGameWithWord" }]
    };
  }
};
