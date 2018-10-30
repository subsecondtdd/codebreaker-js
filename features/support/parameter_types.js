const { defineParameterType } = require('cucumber')

defineParameterType({
  name: 'actor',
  regexp: /[A-Z][a-z]+/,
  transformer(actorName) {
    return this.getActor(actorName)
  },
})
