// This is the START state
module.exports = class HomeController {
  startSession() {
    return {
      description: "home",
      commands: [{ action: "startGameWithWord" }]
    };
  }
};
