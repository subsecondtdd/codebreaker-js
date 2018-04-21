module.exports = class WebApp {
  async get(path) {
    return {
      body: '<form action="/games" data-action="startGameWithWord"></form>'
    };
  }
};
