module.exports = class HomeController {
  openApplication() {
    return {
      description: "home",
      forms: [{ action: "startGameWithWord" }]
    };
  }
};
