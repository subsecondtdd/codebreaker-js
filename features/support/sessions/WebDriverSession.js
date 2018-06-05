const {Builder, By, until} = require('selenium-webdriver')

/**
 * A session that talks to a WebDriver
 */
module.exports = class WebDriverSession {
  constructor({baseUrl}) {
    this._baseUrl = baseUrl
    this._listeners = []
  }

  async start() {
    this._driver = new Builder().forBrowser('firefox').build()
    await this._driver.get(this._baseUrl + '/')

    const joinGameLocator = By.css('input[value="Join Game"]')
    await this._driver.wait(until.elementLocated(joinGameLocator), 10000)
  }

  async stop() {
    //await this._driver.quit()
  }

  async dispatchCommand({name, params}) {
    const form = this._driver.findElement(By.css(`form[data-command="${name}"]`))
    for (const param of Object.keys(params)) {
      const input = form.findElement(By.css(`input[name="${param}"]`))
      if (!input) throw new Error(`No input[name="${param}"]`)
      input.sendKeys(params[param])
    }

    const rootElement = this._driver.findElement(By.css('#app'))


    const submit = await form.findElement(By.css('input[type="submit"]'))
    await submit.click()


    // Wait for a rerender after submitting the form
    // return new Promise(resolve => {
    //   const observer = new MutationObserver(() => {
    //     observer.disconnect()
    //     resolve()
    //   })
    //   observer.observe(this._rootElement, { childList: true })
    //
    //   const submit = form.querySelector('input[type="submit"]')
    //   submit.click()
    // })
  }

  getTestView(name) {
    return getMicroDataFromElement(this._rootElement)[name]
  }

  onResult(fn) {
    fn()
    this._listeners.push(fn)
  }
}

function getMicroDataFromElement(element) {
  function descendToAttribute(scope, attribute) {
    return [].slice.apply(scope.children).reduce(function (props, child) {
      return props.concat(
        child.hasAttribute(attribute)
          ? [child]
          : descendToAttribute(child, attribute)
      )
    }, [])
  }

  function scopesUnder(scope) {
    return descendToAttribute(scope, 'itemscope')
  }

  function propsUnder(scope) {
    return descendToAttribute(scope, 'itemprop')
  }

  function dataAtScope(scope) {
    return propsUnder(scope).reduce(function (props, element) {
      props[element.getAttribute('itemprop')] = dataInPropElement(element)
      return props
    }, {})
  }

  function dataInPropElement(element) {
    const type = element.getAttribute('itemtype')
    switch (type) {
      case 'http://schema.org/Text':
        return element.innerHTML
      case 'http://schema.org/Integer':
        return Number(element.innerHTML)
      case 'http://schema.org/Boolean':
        return Boolean(element.innerHTML)
      case 'http://schema.org/ItemList':
        return scopesUnder(element).map(dataAtScope)
      default:
        throw new Error(
          `Unable to parse element with itemtype '${type}' (itemprop="${element.getAttribute(
            'itemprop'
          )})"`
        )
    }
  }

  const scope = scopesUnder(element)[0]
  if (!scope)
    throw new Error(`Found no itemscope under element: ${element.innerHTML}`)
  return dataAtScope(scope)
}
