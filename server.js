const {WebServer} = require('express-extensions')
const {MemoryPubSub} = require('pubsub-multi')
const Codebreaker = require('./lib/domain/Codebreaker')
const makeWebApp = require('./lib/httpServer/makeWebApp')

async function start() {
  let codebreaker
  const pubSub = new MemoryPubSub({version: () => codebreaker.getVersion()})
  codebreaker = new Codebreaker(pubSub)
  const app = makeWebApp(codebreaker, pubSub, true)
  const webServer = new WebServer(app)

  // setTimeout(() => {
    codebreaker.createGame(`Joe`, "steak")
    codebreaker.createGame(`Sal`, "nice")
  // }, 5000)

  return webServer.listen(parseInt(process.env.PORT || '8997'))
}

start()
  .then(port => console.log(`Ready on http://localhost:${port}`))
  .catch(err => console.error(err.stack))
