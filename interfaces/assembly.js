module.exports = class Assembly {
  chooseConstructor({ role, constructors, owner }) {
    switch (constructors.length) {
      case 1:
        return constructors[0];
      case 0:
        throw new Error(`No constructor registered for role '${role}'`);
      default:
        throw new Error(
          `${
            constructors.length
          } constructors registered for role '${role}': [${constructors
            .map(c => c.name)
            .join(", ")}]`
        );
    }
  }
};
