const getMicrodata = require('../extract/getMicrodata')
const mountApp = require('../../../lib/react/mountApp')
const BaseActor = require('../extract/BaseActor')

/**
 * The Dom Actor interacts with the Dom. It also has a reference to the codebreaker, so it can query for its
 * version. This is used to wait for synchronisation before interacting with the DOM.
 */
module.exports = class DomActor extends BaseActor {
  constructor(name, codebreaker, pubSub) {
    super(pubSub)
    this._name = name
    this._codebreaker = codebreaker
    this._pubSub = pubSub
  }

  getName() {
    return this._name
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
    mountApp(this._$root, this._codebreaker, this._pubSub)
  }

  stop() {
    super.stop()
    this._$actor.parentNode.removeChild(this._$actor)
  }

  // Domain-specific logic goes here...

  joinGameCreatedBy(makerName) {
    const $submit = this._$root.querySelector(`[data-maker="${makerName}"]`)
    $submit.click()
  }

  getCurrentGameLetterCount() {
    return getMicrodata(this._$root)['letterCount']
  }
}
