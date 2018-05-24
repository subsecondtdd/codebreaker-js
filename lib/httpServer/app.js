const HTTPController = require('../controller/HTTPController')
const DomApp = require('../dom/DomApp')

// Starts the web server
async function start() {
  const controller = new HTTPController({
    baseUrl: 'http://localhost:8997',
    fetch: window.fetch.bind(window),
    EventSource: window.EventSource,
  })
  await controller.start()

  const rootElement = document.querySelector('#app')
  const domApp = new DomApp({ rootElement, controller })
  domApp.showIndex()
}

start()
  .then(() => console.log(`Ready!`))
  .catch(err => console.error(err.stack))
