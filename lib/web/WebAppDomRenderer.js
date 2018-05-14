const baseURL = "http://web-app-dom-renderer";

module.exports = class WebAppDomRenderer {
  constructor({ webApp, domApps }) {
    this._renderCount = 0;
    this._webApp = webApp;
    this._domApps = domApps;
    const base = document.createElement("base");
    base.href = baseURL;
    document.head.appendChild(base);
  }

  async renderWebAppInElement({ element, path = "/" }) {
    const response = await this._webApp.get(path);
    element.innerHTML = response.body;
    element.setAttribute("data-render-count", this._renderCount++);
    const domAppsToMount = element.querySelectorAll("[data-mount-browser-app]");
    for (const appMountElement of domAppsToMount) {
      const appName = appMountElement.getAttribute("data-mount-browser-app");
      const eventSourceURL = appMountElement.getAttribute(
        "data-event-source-url"
      );
      const eventSourceRendering = await this._webApp.get(eventSourceURL);
      this._domApps.mountAppInElement({
        appName,
        element: element,
        stream: eventSourceRendering.stream
      });
    }

    element.addEventListener("submit", event => {
      event.preventDefault();
      this.submitForm(event.target, element);
    });
  }

  async submitForm(form, element) {
    const path = form.action.substring(baseURL.length);
    const params = {};
    const inputs = [].slice.apply(
      form.querySelectorAll('input[type="text"],input[type="checkbox"]')
    );
    inputs.forEach(input => {
      const value = input.type === "text" ? input.value : !!input.checked;
      params[input.getAttribute("name")] = value;
    });
    this._webApp.post(path, params).then(rendering => {
      this.renderWebAppInElement({ element, path: rendering.location });
    });
  }
};
