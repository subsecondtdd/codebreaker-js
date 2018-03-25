const { defineParameterType } = require("cucumber");

const characterNamesByRoleName = {
  maker: ["the Maker"],
  breaker: ["the Breaker"]
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
