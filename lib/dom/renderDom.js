module.exports = function renderDom({ rootElement }) {
  rootElement.innerHTML = `
    <div>
      <form data-command="startGame" method="POST">
        <input name="secret" />
      </form>
    </div>
    <div>
      <form data-command="joinGame" method="POST" >
      </form>
    </div>
    <div>
      <form data-command="guess" method="POST" >
        <input name="guess" />
      </form>
    </div>
    <div>
      <form data-command="score" method="POST" >
        <input name="points" />
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


  const form = rootElement.querySelector('form');
  console.log(form.outerHTML)
  form.addEventListener('submit', event => {
    event.preventDefault()
    console.log('submit', event.target)
  })
}

