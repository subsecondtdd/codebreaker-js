const { setWorldConstructor } = require("cucumber");
const {
  Container,
  Assembly,
  characters,
  ports,
  sessions,
  controllers,
  web,
  domApps
} = require("../../lib");

class World {
  constructor() {
    this._cast = {};
    this._container = new Container(new Assembly());
    Object.keys(characters).forEach(role =>
      this._container.register({
        role,
        Constructor: characters[role]
      })
    );
    Object.keys(ports).forEach(role =>
      ports[role].forEach(Constructor =>
        this._container.register({ role, Constructor, scope: "singleton" })
      )
    );
    Object.keys(web).forEach(role =>
      this._container.register({
        role,
        Constructor: web[role],
        scope: "singleton"
      })
    );
    sessions.forEach(Constructor =>
      this._container.register({
        role: "session",
        Constructor
      })
    );
    this._container.register({
      role: "domApps",
      Constructor: domApps,
      scope: "singleton"
    });
    this._container.register({
      role: "controllers",
      Constructor: controllers(this._container)
    });
  }

  findOrCreateCharacter({ roleName, characterName }) {
    let character = this._cast[characterName];
    if (!character) {
      character = this._container.resolve(roleName);
      this._cast[characterName] = character;
    }
    return character;
  }
}

setWorldConstructor(World);
