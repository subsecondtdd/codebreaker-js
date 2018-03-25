class Container {
  constructor(assembly) {
    this.registrations = {};
    this.assembly = assembly;
  }

  register({ role, Constructor }) {
    this.registrations[role] = (this.registrations[role] || []).concat(
      Constructor
    );
  }

  resolve(role, owner) {
    const constructors = this.registrations[role] || [];
    const Constructor = this.assembly.chooseConstructor({
      role,
      constructors,
      owner
    });
    return this.instantiate(Constructor, owner);
  }

  instantiate(Constructor, owner) {
    return new Constructor(
      Injections.build({ Constructor, owner, container: this })
    );
  }
}

class Injections {
  static build({ Constructor, owner, container }) {
    return new Proxy(Constructor, new Injections(owner, container));
  }

  constructor(owner, container) {
    this.owner = owner;
    this.container = container;
  }

  get(target, property) {
    return this.container.resolve(property, this.owner);
  }
}

module.exports = Container;
