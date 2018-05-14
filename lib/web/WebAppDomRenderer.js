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

  async renderWebAppInElement(domElement, path = "/") {
    const response = await this._webApp.get(path);
    domElement.innerHTML = response.body;
    domElement.setAttribute("data-render-count", this._renderCount++);
    const domAppsToMount = domElement.querySelectorAll(
      "[data-mount-browser-app]"
    );
    for (const appMountElement of domAppsToMount) {
      const appName = appMountElement.getAttribute("data-mount-browser-app");
      const eventSourceURL = appMountElement.getAttribute(
        "data-event-source-url"
      );
      const eventSourceRendering = await this._webApp.get(eventSourceURL);
      this._domApps.mountAppInElement({
        appName,
        element: domElement,
        stream: eventSourceRendering.stream
      });
    }

    domElement.addEventListener("submit", event => {
      event.preventDefault();
      this.submitForm(event.target, domElement);
    });
  }

  async submitForm(form, domElement) {
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
      this.renderWebAppInElement(domElement, rendering.location);
    });
  }
};
