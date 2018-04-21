module.exports = class WebApp {
  constructor({ controllers }) {
    this._controllers = controllers;
  }

  async get(path) {
    if (path === "/") {
      return {
        body: `
           <form action="/games" data-action="startGameWithWord">
            <input type="text" name="word" />
            <input type="submit" value="Start Game" />
          </form>
          `
      };
    }
    throw new Error(`GET '${path}' is not implemented`);
  }

  async post(path, params) {
    if (path === "/games") {
      await this._performAction({ action: "startGameWithWord", params });
    } else {
      throw new Error(`POST '${path}' is not implemented`);
    }
  }

  async _performAction({ action, params }) {
    const controller = this._controllers.findControllerWithAction(action);
    const rendering = await controller[action].call(controller, params);
    console.log("rendering", rendering);
    if (!rendering) {
      throw new Error(`Action ${action} returned ${typeof rendering}`);
    }
    if (rendering.stream) {
      throw new Error("Coming soon!");
    }
  }
};
