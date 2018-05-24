/**
 * Client side app. Renders the UI in a DOM node. Listens for DOM events
 * (form submissions) and sends commands to a controller.
 */
module.exports = class DomApp {
  constructor({rootElement, controller}) {
    this._rootElement = rootElement
    this._controller = controller

    rootElement.addEventListener('submit', event => {
      event.preventDefault()

      const form = event.target
      const inputs = [...form.querySelectorAll('input[name]')]
      const params = {}
      for (const input of inputs) {
        params[input.getAttribute("name")] = input.value;
      }
      const name = form.getAttribute('data-command')

      this._controller.dispatch({name, params})
        .then(result => {
          const nextRender = this[result.view]
          if(typeof nextRender !== 'function') throw new Error(`No such method: ${this.constructor.name}#${result.view}`)
          nextRender.call(this, result)
        })
        .catch(err => {
          if(window.location.href.startsWith('http')) {
            // Ignore fetch errors unless we're running in a browser
            console.error(err.stack)
          }
        })
    })
  }

  showIndex() {
    this._rootElement.innerHTML = `
    <div>
      <form data-command="joinGame" method="POST" >
        <input value="Join Game" type="submit"/>
      </form>
    </div>
    <div>
      <form data-command="startGame" method="POST">
        <input name="secret" type="text" placeholder="Secret word"/>
        <input value="Start Game" type="submit"/>
      </form>
    </div>
  `
    this._rootElement.dispatchEvent(new CustomEvent('updated'))
  }

  showMakerGame({data, subscribe}) {
    const render = ({data}) => {
      this._rootElement.innerHTML = `
        <div itemscope>
          <h2><span itemscope itemprop="wordLength" itemtype="http://schema.org/Integer">${data.wordLength}</span> letter game</h2>
          ${data.errorMessage ? `<div itemscope itemprop="errorMessage" itemtype="http://schema.org/Text">${data.errorMessage}</div>` : ''}
          <div style="display: none" itemscope itemprop="gameId" itemtype="http://schema.org/Text">${data.gameId}</div>
          <div style="display: block" itemscope itemprop="gameVersion" itemtype="http://schema.org/Integer">${data.gameVersion}</div>
          <div itemscope itemprop="gameState" itemtype="http://schema.org/Text">${data.gameState}</div>
          <table itemscope itemprop="guessList" itemtype="http://schema.org/ItemList">
            <thead>
              <tr>
                <th>Guesses</th>
                <th>Scores</th>
              </tr>
            </thead>
            <tbody>
            ${data.guessList.map(guess => `
              <tr itemscope>
                <td itemprop="guess" itemtype="http://schema.org/Text">${guess.guess}</td>
                ${guess.points ?
                  `<td itemprop="points" itemtype="http://schema.org/Integer">${guess.points}</td>`
                :
                  `<td>
                    <div class="row">
                      <form data-command="score" method="POST" >
                        <input name="gameId" type="hidden" value="${data.gameId}"/>
                        <div class="column">
                          <input name="points" type="text" placeholder="Number of correct letters"/>
                        </div>
                        <div class="column">
                          <input value="Score" type="submit"/>
                        </div>
                      </form>
                      <form data-command="scoreCorrect" method="POST" >
                        <input name="gameId" type="hidden" value="${data.gameId}"/>
                        <div class="column">
                          <input value="Score Correct" type="submit"/>
                        </div>
                      </form>
                    </div>
                  </td>
                  `
                }
              </tr>
            `)}
            </tbody>
          </table>
        </div>
      `
    }

    render({data})
    subscribe(render)
  }

  showBreakerGame({data, subscribe}) {
    const render = ({data}) => {
      this._rootElement.innerHTML = `
        <div itemscope>
          <h2><span itemscope itemprop="wordLength" itemtype="http://schema.org/Integer">${data.wordLength}</span> letter game</h2>
          ${data.errorMessage ? `<div itemscope itemprop="errorMessage" itemtype="http://schema.org/Text">${data.errorMessage}</div>` : ''}
          <div style="display: none" itemscope itemprop="gameId" itemtype="http://schema.org/Text">${data.gameId}</div>
          <div style="display: block" itemscope itemprop="gameVersion" itemtype="http://schema.org/Integer">${data.gameVersion}</div>
          <div itemscope itemprop="gameState" itemtype="http://schema.org/Text">${data.gameState}</div>
          <table itemscope itemprop="guessList" itemtype="http://schema.org/ItemList">
            <thead>
              <tr>
                <th>Guesses</th>
                <th>Scores</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <form data-command="guess" method="POST" >
                    <input name="gameId" type="hidden" value="${data.gameId}"/>
                    <div class="row">
                      <div class="column">
                        <input name="guess" type="text" placeholder="Your guess"/>
                      </div>
                      <div class="column">
                        <input value="Guess" type="submit"/>
                      </div>
                    </div>
                  </form>
                </td>
                <td></td>
              </tr>
            ${data.guessList.map(guess => `
              <tr itemscope>
                <td itemprop="guess" itemtype="http://schema.org/Text">${guess.guess}</td>
                <td itemprop="points" itemtype="http://schema.org/Integer">${guess.points}</td>
              </tr>
            `)}
            </tbody>
          </table>
        </div>
      `
    }

    render({data})
    subscribe(render)
  }}
