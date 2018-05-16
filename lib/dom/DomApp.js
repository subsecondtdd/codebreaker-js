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

      const result = this._controller.dispatch({name, params})
      const nextRender = this[result.view]
      nextRender.call(this, result)
    })
  }

  showIndex() {
    this._rootElement.innerHTML = `
    <div>
      <form data-command="startGame" method="POST">
        <input name="secret" />
        <input value="Start Game" type="submit"/>
      </form>
    </div>
    <div>
      <form data-command="joinGame" method="POST" >
        <input value="Join Game" type="submit"/>
      </form>
    </div>
  `
  }

  showGame({data, subscribe}) {
    const render = ({data}) => {
      this._rootElement.innerHTML = `
        <div itemscope>
          <h2><span itemscope itemprop="wordLength" itemtype="http://schema.org/Integer">${data.wordLength}</span> character game</h2>
          ${$if(data.errorMessage, `<div itemscope itemprop="errorMessage" itemtype="http://schema.org/Text">${data.errorMessage}</div>`)}
          <div>
            <form data-command="guess" method="POST" >
              <input name="guess" />
              <input value="Guess" type="submit"/>
            </form>
          </div>
          <div>
            <form data-command="score" method="POST" >
              <input name="points" />
              <input value="Score" type="submit"/>
            </form>
          </div>
          <div itemscope itemprop="gameState" itemtype="http://schema.org/Text">${data.gameState}</div>
          <ol itemscope itemprop="guessList" itemtype="http://schema.org/ItemList">
          ${data.guessList.map(guess => `
            <li itemscope>
              Guess: <span itemprop="guess" itemtype="http://schema.org/Text">${guess.guess}</span>
              <br>
              ${$if(guess.points, `Points: <span itemprop="points" itemtype="http://schema.org/Integer">${guess.points}</span>`)}
            </li>
          `)}
          </ol>
        </div>
      `
    }

    render({data})
    subscribe(render)
  }
}

function $if(cond, text) {
  return cond ? text : ''
}
