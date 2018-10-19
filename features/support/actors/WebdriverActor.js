const {Builder, By, until} = require('selenium-webdriver')
const BaseActor = require('../extract/BaseActor')

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
    this._driver = new Builder().forBrowser('firefox').build()
    await this._driver.get(this._baseUrl + '/')
  }

  async stop() {
    super.stop()
    await this._driver.quit()
  }

  // Domain-specific logic goes here...

  async joinGameCreatedBy(makerName) {
    const selector = `[data-maker="${makerName}"]`
    const locator = By.css(selector)
    await this._driver.wait(until.elementLocated(locator), 3000)
    await this._driver.findElement(locator).click()
  }

  async getCurrentGameLetterCount() {
    const selector = `.game [itemProp="letterCount"]`
    const locator = By.css(selector)
    await this._driver.wait(until.elementLocated(locator), 3000)
    const element = await this._driver.findElement(locator)
    return Number(await element.getText())
  }
}
