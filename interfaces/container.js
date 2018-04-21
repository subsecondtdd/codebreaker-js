class Container {
  constructor(assembly) {
    this.registrations = {};
    this.singletons = {};
    this.assembly = assembly;
  }

  register({ role, Constructor, scope }) {
    this.registrations[role] = (this.registrations[role] || []).concat({
      Constructor,
      scope
    });
  }

  resolve(role) {
    if (this.singletons[role]) {
      return this.singletons[role];
    }
    const registrations = this.registrations[role] || [];
    const registration = this.assembly.chooseRegistration({
      role,
      registrations
    });
    const instance = this.instantiate(registration.Constructor);
    if (registration.scope === "singleton") {
      this.singletons[role] = instance;
    }
    return instance;
  }

  instantiate(Constructor) {
    return new Constructor(Injections.build({ Constructor, container: this }));
  }
}

class Injections {
  static build({ Constructor, container }) {
    return new Proxy(Constructor, new Injections(container));
  }

  constructor(container) {
    this.container = container;
  }

  get(target, property) {
    return this.container.resolve(property);
  }
}

module.exports = Container;
