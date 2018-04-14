module.exports = class ObjectBrowser {
  constructor({ controllers }) {
    this._controllers = controllers;
    this._id = nextId++;
  }

  async openApplication() {
    await this._performAction({
      action: "openApplication",
      params: {}
    });
  }

  async startGameWithWord({ word }) {
    await this.submitForm({
      action: "startGameWithWord",
      params: { word }
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

  async submitForm({ action, params }) {
    const forms = this._renderedView.forms;
    if (!forms) {
      throw new Error(`View has no forms: ${this._inspectView()}`);
    }
    const form = this._renderedView.forms.find(form => form.action === action);
    if (form) {
      const mergedParams = Object.assign({}, params, form.params);
      await this._performAction({ action, params: mergedParams });
    } else {
      throw new Error(
        `View has no form with action '${action}': ${this._inspectView()}`
      );
    }
  }

  async _performAction({ action, params }) {
    const controller = this._controllers.findControllerWithAction(action);
    const rendering = await controller[action].call(controller, params);
    if (!rendering) {
      throw new Error(`Action ${action} returned ${typeof rendering}`);
    }
    if (rendering.stream) {
      await this._renderStream(rendering.stream);
    } else {
      this._renderedView = rendering;
    }
  }

  async _renderStream(stream) {
    const { emitter, action, params } = stream;
    const changeCallback = async () => {
      await this._performAction({ action, params });
    };
    emitter.addListener(changeCallback);
    await changeCallback();
  }

  _inspectView() {
    return JSON.stringify(this._renderedView);
  }
};

let nextId = 0;
