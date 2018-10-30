const webdriverio = require('webdriverio')
const BaseActor = require('../extract/BaseActor')
const getMicrodata = require('../extract/getMicrodata')

/**
 * The Dom Actor interacts with the Dom. It also has a reference to the codebreaker, so it can query for its
 * version. This is used to wait for synchronisation before interacting with the DOM.
 */
module.exports = class WebDriverActor extends BaseActor {
  constructor(name, sub, baseUrl) {
    super(name, sub)
    this._baseUrl = baseUrl
  }

  async start() {
    super.start()

    this._browser = webdriverio.multiremote({
      chrome: {
        desiredCapabilities: {
          browserName: 'chrome'
        }
      }
    })
    await this._browser.init().url(this._baseUrl)
  }

  async stop() {
    super.stop()
    try {
      await this._browser.close()
    } catch (err) {
      // We always get an error, but the browser seems to close(?)
    }
  }

  async getTestView() {
    const result = await this._browser.executeAsync(function (getMicrodataSource, done) {
      eval(getMicrodataSource)
      done(getMicrodata(document.body))
    }, getMicrodata.toString())
    const microdata = result.chrome.value
    return microdata
  }

  // Domain-specific logic goes here...

  // TODO: Have a single DomActor that delegates to WebdriverBrowser or a "DomBrowser"
  // The Browser interface should expose a minimum API. Alternatively, make a "DomDriver", with
  // an API similar to WebDriverIO, although that seems like a big API to implement.

  async createGame(secret) {
    await this._browser.setValue('input', secret)
    await this._browser.click('button')
  }

  async joinGameCreatedBy(makerName) {
    const selector = `[data-maker="${makerName}"]`
    await this._browser.waitForExist(selector)
    await this._browser.click(selector)
  }

  async getGames() {
    const testView = await this.getTestView()
    return testView['games']
  }

  async getCurrentGameLetterCount() {
    const testView = await this.getTestView()
    return testView['letterCount']
  }
}
