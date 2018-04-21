module.exports = class WebApp {
  async get(path) {
    return {
      body: `<form action="/games" data-action="startGameWithWord" onsubmit="return false">
          <input name="word" />
          <input type="submit" value="Start Game" />
        </form>`
    };
  }
};
