const {WebServer} = require('express-extensions')
const DomainController = require('./lib/controller/DomainController')
const makeWebApp = require('./lib/httpServer/makeWebApp')

async function start() {
  const controller = new DomainController()
  const app = makeWebApp({controller, serveClientApp: true})
  const webServer = new WebServer(app)
  return webServer.listen(parseInt(process.env.PORT || '8997'))
}

start()
  .then(port => console.log(`Ready on http://localhost:${port}`))
  .catch(err => console.error(err.stack))