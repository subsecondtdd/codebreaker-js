const baseURL = "http://web-app-dom-renderer";

module.exports = class WebAppDomRenderer {
  constructor({ webApp, browserApps }) {
    this._webApp = webApp;
    this._browserApps = browserApps;
    const base = document.createElement("base");
    base.href = baseURL;
    document.head.appendChild(base);
  }

  async renderWebAppInElement(domElement, path = "/") {
    const response = await this._webApp.get(path);
    domElement.innerHTML = response.body;
    const browserAppsToMount = domElement.querySelectorAll(
      "[data-mount-browser-app]"
    );
    for (const appMountElement of browserAppsToMount) {
      const appName = appMountElement.getAttribute("data-mount-browser-app");
      const eventSourceURL = appMountElement.getAttribute(
        "data-event-source-url"
      );
      const eventSourceRendering = await this._webApp.get(eventSourceURL);
      this._browserApps.mountAppInElement({
        appName,
        element: domElement,
        stream: eventSourceRendering.stream
      });
    }

    domElement.querySelectorAll("form").forEach(form => {
      form.addEventListener("submit", event => {
        event.preventDefault();
        this.submitForm(event.target, domElement);
      });
    });
  }

  async submitForm(form, domElement) {
    const path = form.action.substring(baseURL.length);
    const params = {};
    const inputs = [].slice.apply(form.querySelectorAll('input[type="text"]'));
    inputs.forEach(input => {
      params[input.getAttribute("name")] = input.value;
    });
    this._webApp.post(path, params).then(rendering => {
      this.renderWebAppInElement(domElement, rendering.location);
    });
  }
};
