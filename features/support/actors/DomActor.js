const getMicrodata = require('../extract/getMicrodata')
const mountApp = require('../../../lib/react/mountApp')
const BaseActor = require('../extract/BaseActor')

module.exports = class DomActor extends BaseActor {
  constructor(name, sub, codebreaker) {
    super(name, sub)
    this._codebreaker = codebreaker
  }

  start() {
    super.start()
    if (this._$root) throw new Error(`DomActor ${this._name} already started`)

    // Prevent previous scenario's URL from interfering
    window.history.pushState(null, null, '/')
    this._$actor = document.createElement('div')
    this._$actor.innerHTML = `<h1>${this._name}</h1>`
    document.body.appendChild(this._$actor)
    this._$root = document.createElement('div')
    this._$actor.appendChild(this._$root)
    mountApp(this._$root, this._codebreaker, this._sub)
  }

  stop() {
    super.stop()
    if (!process.env.KEEP_DOM)
      this._$actor.parentNode.removeChild(this._$actor)
  }

  // Domain-specific logic goes here...

  joinGameCreatedBy(makerName) {
    const selector = `[data-maker="${makerName}"]`
    const $submit = this._$root.querySelector(selector)
    $submit.click()
  }

  getCurrentGameLetterCount() {
    return getMicrodata(this._$root)['letterCount']
  }
}
