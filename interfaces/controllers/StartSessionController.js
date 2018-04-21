// This is the START state
module.exports = class StartSessionController {
  startSession() {
    return {
      description: "home",
      commands: [{ action: "startGameWithWord" }]
    };
  }
};
