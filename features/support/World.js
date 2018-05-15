const { setWorldConstructor } = require("cucumber");
const Player = require("./Player");
const DirectSession = require("../../lib/ptb/DirectSession");
const DomSession = require("../../lib/ptb/DomSession");
const CodeBreakerController = require("../../lib/CodeBreakerController");

function renderDom({ rootElement }) {
  rootElement.innerHTML = `
    <div>
      <form data-command="startGame">
        <input name="secret" />
      </form>
    </div>
    <div>
      <form data-command="joinGame">
      </form>
    </div>
    <div>
      <form data-command="guess">
        <input name="guess" />
      </form>
    </div>
    <div>
      <form data-command="score">
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
}

class World {
  constructor() {
    this._cast = {};
    this._controller = new CodeBreakerController();
  }

  findOrCreatePlayer(playerName) {
    if (this._cast[playerName]) return this._cast[playerName];

    const sessionFactories = {
      DomSession: controller => new DomSession({ render: renderDom }),
      DirectSession: controller => new DirectSession({ controller })
    }

    const makeSession = sessionFactories[process.env.SESSION || 'DirectSession']
    const session = makeSession(this._controller);
    const player = new Player({ session });
    this._cast[playerName] = player;
    return player;
  }
}
setWorldConstructor(World);
