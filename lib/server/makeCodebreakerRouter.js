const express = require('express')
const browserify = require('browserify-middleware')
const {asyncRouter, respond} = require('express-extensions')

/**
 * Server side HTTP router. Handles HTTP requests issued by HTTPController
 * and translates them into commands sent to another controller (typically DomainController)
 *
 * Subscribes to updates from the controller and pushes those to connected clients as server-sent events.
 */
module.exports = (codebreaker, serveClientApp) => {
  const router = asyncRouter()

  if (serveClientApp) {
    router.get('/js/app.js', browserify(__dirname + '/app.js'))
  }

  const stat = express.static('public')

  router.get('/games/:gameId', (req, res, next) => {
    req.url = '/'
    stat(req, res, next)
  })

  router.$get('/api/games', async (req, res) => {
    const games = await codebreaker.getGames()
    respond(games, res)
  })

  router.$post('/api/games', async (req, res) => {
    const {makerName, secret} = req.body
    await codebreaker.createGame(makerName, secret)
    res.status(201).end()
  })

  router.$post('/api/games/:gameId/maker', async (req, res) => {
    const {gameId} = req.params
    const {makerName} = req.body
    await codebreaker.startGame(gameId, makerName)
    res.status(201).end()
  })

  return router

}
