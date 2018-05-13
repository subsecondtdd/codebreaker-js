const eventually = require("./eventually");

module.exports = class DomSession {
  constructor({ webAppDomRenderer }) {
    this._webAppDomRenderer = webAppDomRenderer;
  }

  async startSession() {
    await this._ensureElement();
    await this._webAppDomRenderer.renderWebAppInElement(this._element, "/");
  }

  async openLink(href) {
    await this._ensureElement();
    await this._webAppDomRenderer.renderWebAppInElement(this._element, href);
  }

  async _ensureElement() {
    if (this._element) {
      return;
    }
    this._element = document.createElement("div");
    this._element.style.border = "1px solid green";
    this._element.style.margin = "5px";
    this._element.style.padding = "5px";
    document.body.appendChild(this._element);
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
      const input = inputs[0];
      const value = params[param];
      if (input.type === "checkbox") {
        input.checked = value;
      } else if (input.type === "text") {
        input.value = value;
      } else {
        throw new Error(`Unable to set input with type="${input.type}"`);
      }
    });
    const submits = form.querySelectorAll('input[type="submit"]');
    if (submits.length !== 1) {
      throw new Error(`Found ${submits.length} submit elements`);
    }
    const submit = submits[0];

    const renderCount = () => this._element.getAttribute("data-render-count");
    const renderCountBeforeClicking = renderCount();
    const descriptionBeforeClicking = this.describeView();
    submit.click();
    await eventually(async () => {
      if (
        descriptionBeforeClicking === this.describeView() &&
        renderCountBeforeClicking === renderCount()
      ) {
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

  getVisibleLink({ action }) {
    const selector = `a[data-action="${action}"]`;
    const elements = this._element.querySelectorAll(selector);
    if (elements.length === 1) {
      return elements[0].getAttribute("href");
    }
    throw new Error(
      `Found ${elements.length} elements with selector ${selector}`
    );
  }

  getVisibleData(key) {
    const selector = `[data-role="data"]`;
    const elements = this._element.querySelectorAll(selector);
    if (elements.length === 1) {
      return JSON.parse(elements[0].innerText)[key];
    }
    throw new Error(
      `Found ${elements.length} elements with selector ${selector}`
    );
  }
};
