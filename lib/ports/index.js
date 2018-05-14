const components = {
  gameStore: [require("./gameStore/MemoryGameStore")],
  idGenerator: [require("./idGenerator/SerialIdGenerator")]
};

exports.registerIn = container =>
  Object.keys(components).forEach(role =>
    components[role].forEach(Constructor =>
      container.register({ role, Constructor, scope: "singleton" })
    )
  );
