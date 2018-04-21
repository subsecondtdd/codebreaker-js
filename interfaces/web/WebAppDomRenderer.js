module.exports = class WebAppDomRenderer {
  constructor({ webApp }) {
    this._webApp = webApp
  }

  async renderWebAppInElement(domElement) {
    const response = await this._webApp.get('/')
    domElement.innerHTML = response.body
  }
}
