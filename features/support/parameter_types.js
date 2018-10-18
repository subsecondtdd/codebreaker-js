const { defineParameterType } = require('cucumber')

defineParameterType({
  name: 'player',
  regexp: /the [A-Z][a-z]+/,
  transformer(playerName) {
    return this.findOrCreatePlayer(playerName)
  },
})

defineParameterType({
  name: 'actor',
  regexp: /[A-Z][a-z]+/,
  transformer(actorName) {
    return this.getActor(actorName)
  },
})
