const express = require('express')
const makeCodebreakerRouter = require('./makeCodebreakerRouter')
const { pubSubRouter } = require('pubsub-multi')

// Assembles the web app
module.exports = (codebreaker, pubSub, serveClientApp) => {
  const app = express()
  app.use(express.static('public'))
  app.use(express.static('node_modules/milligram/dist'))
  app.use(express.json())
  app.use(makeCodebreakerRouter(codebreaker, serveClientApp))
  app.use(pubSubRouter(pubSub, '/api/pubsub'))
  return app
}
