module.exports = class DirectSession {
  constructor({ controllers }) {
    this._controllers = controllers;
  }

  async startSession() {
    await this._performAction({
      action: "startSession",
      params: {}
    });
  }

  async openLink(link) {
    await this._performAction({
      action: link.action,
      params: link.params
    });
  }

  describeView() {
    return this._renderedView.description;
  }

  getVisibleLink({ action }) {
    const links = this._renderedView.links;
    if (!links) {
      throw new Error(`View has no links: ${this._inspectView()}`);
    }
    const link = links.find(link => link.action === action);
    if (!link) {
      throw new Error(`No link with action ${action}`);
    }
    return link;
  }

  getVisibleData(key) {
    const data = this._renderedView.data;
    if (!data) {
      throw new Error(`View has no data: ${this._inspectView()}`);
    }
    const value = data[key];
    if (typeof value === "undefined") {
      throw new Error(
        `View has no data with key '${key}': ${this._inspectView()}`
      );
    }
    return value;
  }

  async dispatchCommand({ action, params }) {
    const commands = this._renderedView.commands;
    if (!commands) {
      throw new Error(`View has no commands: ${this._inspectView()}`);
    }
    const command = this._renderedView.commands.find(
      command => command.action === action
    );
    if (command) {
      const mergedParams = Object.assign({}, params, command.params);
      await this._performAction({ action, params: mergedParams });
    } else {
      throw new Error(
        `View has no command with action '${action}': ${this._inspectView()}`
      );
    }
  }

  async _performAction({ action, params }) {
    const controller = this._controllers.findControllerWithAction(action);
    const renderedView = await controller[action].call(controller, params);
    if (!renderedView) {
      throw new Error(`Action ${action} returned ${typeof renderedView}`);
    } else if (typeof renderedView === "function") {
      await this._renderResponseStream(renderedView);
    } else if (renderedView.redirectTo) {
      await this._performAction(renderedView.redirectTo);
    } else {
      this._renderedView = renderedView;
    }
  }

  async _renderResponseStream(responder) {
    const listener = async rendering => {
      this._renderedView = rendering;
    };
    await responder(listener);
  }

  _inspectView() {
    return JSON.stringify(this._renderedView);
  }
};
