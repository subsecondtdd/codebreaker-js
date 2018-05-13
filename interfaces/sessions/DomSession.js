const eventually = require("./eventually");

module.exports = class DomSession {
  constructor({ webAppDomRenderer }) {
    this._webAppDomRenderer = webAppDomRenderer;
  }

  async startSession() {
    this._element = document.createElement("div");
    this._element.style.border = "1px solid green";
    document.body.appendChild(this._element);
    await this._webAppDomRenderer.renderWebAppInElement(this._element);
  }

  async dispatchCommand({ action, params }) {
    const forms = [].slice
      .apply(this._element.querySelectorAll("form"))
      .filter(form => form.getAttribute("data-action") === action);
    if (forms.length !== 1) {
      throw new Error(
        `Found ${forms.length} forms with data-action="${action}"`
      );
    }
    const form = forms[0];
    Object.keys(params).forEach(param => {
      const inputs = form.querySelectorAll(`input[name="${param}"]`);
      if (inputs.length !== 1) {
        throw new Error(`Found ${inputs.length} inputs for param '${param}'`);
      }
      inputs[0].value = params[param];
    });
    const submits = form.querySelectorAll('input[type="submit"]');
    if (submits.length !== 1) {
      throw new Error(`Found ${submits.length} submit elements`);
    }
    const submit = submits[0];

    const descriptionBeforeClicking = this.describeView();
    submit.click();
    await eventually(async () => {
      if (descriptionBeforeClicking === this.describeView()) {
        throw new Error(
          `Expected data-view-description to change from '${descriptionBeforeClicking}'`
        );
      }
    });
  }

  describeView() {
    const elements = this._element.querySelectorAll("[data-view-description]");
    if (elements.length === 1) {
      return elements[0].getAttribute("data-view-description");
    } else if (elements.length === 0) {
      return null;
    }
    throw new Error(
      `Found ${elements.length} elements with [data-view-description]`
    );
  }
};
