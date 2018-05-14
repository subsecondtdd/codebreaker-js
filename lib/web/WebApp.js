module.exports = class WebApp {
  constructor({ controllers }) {
    this._controllers = controllers;
  }

  async get(path) {
    if (path === "/") {
      return {
        statusCode: 200,
        contentType: "text/html",
        body: `
           <form action="/games" data-action="startGameWithWord">
            <input type="text" name="word" />
            <input type="submit" value="Start Game" />
          </form>
          `
      };
    } else if (path.indexOf("/maker/event-source") > -1) {
      const gameId = path.match(/games\/([^/]+)/)[1];
      const rendering = await this._performAction({
        action: "playAsMaker",
        params: { gameId }
      });
      return {
        statusCode: 200,
        contentType: "text/event-stream",
        stream: rendering
      };
    } else if (path.indexOf("/maker") > -1) {
      return {
        statusCode: 200,
        contentType: "text/html",
        body: `<html><body><script src="mountPlayAsMakerApp.js"
          data-mount-browser-app="PlayAsMakerApp" data-event-source-url="${path +
            "/event-source"}"></script></body></html>`
      };
    } else if (path.indexOf("/breaker/event-source") > -1) {
      const gameId = path.match(/games\/([^/]+)/)[1];
      const rendering = await this._performAction({
        action: "playAsBreaker",
        params: { gameId }
      });
      return {
        statusCode: 200,
        contentType: "text/event-stream",
        stream: rendering
      };
    } else if (path.indexOf("/breaker") > -1) {
      // TODO: use a router
      const gameId = path.split("/")[2];
      const rendering = await this._performAction({
        action: "joinGame",
        params: { gameId }
      });
      return {
        statusCode: 200,
        contentType: "text/html",
        body: `<html><body><script src="mountPlayAsBreakerApp.js"
          data-mount-browser-app="PlayAsBreakerApp" data-event-source-url="${path +
            "/event-source"}"></script></body></html>`
      };
    }
    throw new Error(`GET '${path}' is not implemented`);
  }

  async post(path, params) {
    if (path === "/games") {
      const rendering = await this._performAction({
        action: "startGameWithWord",
        params
      });
      return {
        statusCode: 201,
        location: `/games/${rendering.redirectTo.params.gameId}/maker`
      };
    } else if (path.match(/\/guesses$/)) {
      // TODO: use a router
      const gameId = path.split("/")[2];
      const rendering = await this._performAction({
        action: "guessWord",
        params: Object.assign({}, params, { gameId })
      });
      return {
        statusCode: 201,
        location: `/games/${gameId}/breaker`
      };
    } else if (path.match(/\/scores/)) {
      // TODO: use a router
      const gameId = path.split("/")[2];
      const rendering = await this._performAction({
        action: "scoreLatestGuess",
        params: Object.assign({}, params, { gameId })
      });
      return {
        statusCode: 201,
        location: `/games/${gameId}/maker`
      };
    } else {
      throw new Error(`POST '${path}' is not implemented`);
    }
  }

  async _performAction({ action, params }) {
    const controller = this._controllers.findControllerWithAction(action);
    const rendering = await controller[action].call(controller, params);
    if (!rendering) {
      throw new Error(`Action ${action} returned ${typeof rendering}`);
    }
    return rendering;
  }
};