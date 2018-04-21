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
    Object.keys(params).forEach(param => {
      const inputs = this._element.querySelectorAll(`input[name="${param}"]`);
      if (inputs.length !== 1) {
        throw new Error(`Found ${inputs.length} inputs for param '${param}'`);
      }
      input.value = params[param];
    });
  }
};
