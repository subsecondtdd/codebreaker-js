module.exports = (session) => {
  return function renderDom({rootElement}) {
    rootElement.innerHTML = `
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
    <div itemscope>
      <div itemscope itemprop="gameState" itemtype="http://schema.org/Text">Score guess</div>
      <ol itemscope itemprop="guessList" itemtype="http://schema.org/ItemList">
        <li itemscope>
          Points: <span itemprop="points" itemtype="http://schema.org/Integer">2</span>
        </li>
      </ol>
    </div>
  `


    rootElement.addEventListener('submit', event => {
      event.preventDefault()

      const form = event.target
      const inputs = [...form.querySelectorAll('input[type="text"]')]
      const params = {}
      for(const input of inputs) {
        params[input.getAttribute("name")] = input.value;
      }

      const name = form.getAttribute('data-command')
      session.dispatchCommand({ name, params })
    })
  }
}
