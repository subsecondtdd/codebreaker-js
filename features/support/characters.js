const { defineParameterType } = require("cucumber");

const characterNamesByRoleName = {
  player: ["the Maker", "the Breaker"]
};

Object.keys(characterNamesByRoleName).forEach(roleName =>
  defineParameterType({
    name: roleName,
    regexp: new RegExp(characterNamesByRoleName[roleName].join("|")),
    transformer(characterName) {
      return this.findOrCreateCharacter({ roleName, characterName });
    }
  })
);
