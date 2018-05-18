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
          nextRender.call(this, result)
        })
        .catch(err => console.error(err))
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
          ${data.errorMessage ? `<div itemscope itemprop="errorMessage" itemtype="http://schema.org/Text">${data.errorMessage}</div>` : ''}
          <div itemscope itemprop="gameState" itemtype="http://schema.org/Text">${data.gameState}</div>
          <table itemscope itemprop="guessList" itemtype="http://schema.org/ItemList">
            <tr>
              <td>
                <form data-command="guess" method="POST" >
                  <input name="guess" />
                  <input value="Guess" type="submit"/>
                </form>
              </td>
              <td></td>
              <td></td>
            </tr>
          ${data.guessList.map(guess => `
            <tr itemscope>
              <td itemprop="guess" itemtype="http://schema.org/Text">${guess.guess}</td>
              ${guess.points ? 
                `<td itemprop="points" itemtype="http://schema.org/Integer">${guess.points}</td>` : 
                `<td>
                  <form data-command="score" method="POST" >
                    <input name="points" />
                    <input value="Score" type="submit"/>
                  </form>
                </td>
                <td>
                  <form data-command="scoreCorrect" method="POST" >
                    <input value="Score Correct" type="submit"/>
                  </form>
                </td>
                `}
            </tr>
          `)}
          </table>
        </div>
      `
    }

    render({data})
    subscribe(render)
  }
}
