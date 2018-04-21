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
    submit.click();
  }
};
