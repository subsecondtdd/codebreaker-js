const { defineParameterType } = require("cucumber");

const roles = {
  Maker: ["the Maker"],
  Breaker: ["the Breaker"]
};

Object.keys(roles).forEach(roleName => {
  defineParameterType({
    name: roleName,
    regexp: new RegExp(roles[roleName].join("|")),
    transformer(name) {
      return this.assembly.createCharacter({ roleName, name });
    }
  });
});
