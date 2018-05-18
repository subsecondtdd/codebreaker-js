const DomainController = require('./lib/controller/DomainController')
const makeWebServer = require('./lib/httpServer/makeWebServer')

async function start() {
  const controller = new DomainController()
  const webServer = makeWebServer({controller, serveClientApp: true})
  return webServer.listen(parseInt(process.env.PORT || '8997'))
}

start()
  .then(port => console.log(`Ready on http://localhost:${port}`))
  .catch(err => console.error(err.stack))