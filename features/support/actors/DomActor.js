const getMicrodata = require('../extract/getMicrodata')
const mountApp = require('../../../lib/react/mountApp')
const BaseActor = require('../extract/BaseActor')
const change = require('react-trigger-change')

const loc = (typeof window === 'object') ? window.location.href : null

module.exports = class DomActor extends BaseActor {
  constructor(name, sub, codebreaker) {
    super(name, sub)
    this._codebreaker = codebreaker
  }

  start() {
    super.start()
    if (this._$root) throw new Error(`DomActor ${this._name} already started`)

    // Prevent previous scenario's URL from interfering
    window.history.pushState(null, null, loc)
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

  getTestView() {
    return getMicrodata(this._$root)
  }

  // Domain-specific logic goes here...

  async createGame(secret) {
    const $input = this._$root.querySelector('input')
    $input.value = secret
    change($input)

    const $button = this._$root.querySelector('button')
    $button.click()
  }

  joinGameCreatedBy(makerName) {
    const selector = `[data-maker="${makerName}"]`
    const $submit = this._$root.querySelector(selector)
    $submit.click()
  }

  getGames() {
    return this.getTestView()['games']
  }

  getCurrentGameLetterCount() {
    return this.getTestView()['letterCount']
  }
}
