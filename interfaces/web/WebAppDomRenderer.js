const baseUrl = "http://web-app-dom-renderer";

module.exports = class WebAppDomRenderer {
  constructor({ webApp }) {
    this._webApp = webApp;
    const base = document.createElement("base");
    base.href = baseUrl;
    document.head.appendChild(base);
  }

  async renderWebAppInElement(domElement) {
    const response = await this._webApp.get("/");
    domElement.innerHTML = response.body;
    domElement.querySelectorAll("form").forEach(form => {
      form.addEventListener("submit", event => {
        event.preventDefault();
        const path = event.target.action.substring(baseUrl.length);
        const params = {};
        const inputs = [].slice.apply(
          form.querySelectorAll('input[type="text"]')
        );
        inputs.forEach(input => {
          params[input.getAttribute("name")] = input.value;
        });
        this._webApp.post(path, params);
      });
    });
  }
};
