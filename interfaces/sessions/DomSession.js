module.exports = class DomSession {
  constructor({ webAppDomRenderer }) {
    this._webAppDomRenderer = webAppDomRenderer;
  }

  async startSession() {
    const div = document.createElement("div");
    div.style.border = "1px solid green";
    document.body.appendChild(div);
    await this._webAppDomRenderer.renderWebAppInElement(div);
  }

  async dispatchCommand({ action, params }) {
    const forms = [].slice
      .apply(document.querySelectorAll("form"))
      .filter(form => form.getAttribute("data-action") === action);
    if (forms.length !== 1) {
      throw new Error(
        `Found ${forms.length} forms with data-action="${action}"`
      );
    }
    throw new Error("wip");
  }
};
