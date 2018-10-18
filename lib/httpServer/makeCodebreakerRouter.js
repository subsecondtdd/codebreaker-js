const browserify = require('browserify-middleware')
const nanoid = require('nanoid')
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

  router.$get('/api/games', async (req, res) => {
    const games = await codebreaker.getGames()
    respond(games, res)
  })

  router.$post('/api/games/:gameId/maker', async (req, res) => {
    const {gameId} = req.params
    const {makerName} = req.body
    await codebreaker.startGame(gameId, makerName)
    res.status(201).end()
  })

  // router.post('/api/games', (req, res) => {
  //   console.log("HALLOOOOO")
  //   const result = codebreaker.startGame(req.body)
  //   res.redirect(303, `/api/games/${result.nextQuery.params.gameId}/maker`)
  // })

  // router.get('/api/games/:gameId/maker', (req, res) => {
  //   const {gameId} = req.params
  //   const result = subscribe(
  //     controller.showMakerGame({gameId}),
  //     req.headers['x-connection-id']
  //   )
  //   res.json(result)
  // })
  //
  // router.get('/api/games/:gameId/breaker', (req, res) => {
  //   const {gameId} = req.params
  //   const result = subscribe(
  //     controller.showBreakerGame({gameId}),
  //     req.headers['x-connection-id']
  //   )
  //   res.json(result)
  // })
  //
  // router.post('/api/games/:gameId/breaker', (req, res) => {
  //   const {gameId} = req.params
  //   const result = controller.joinGame(Object.assign({}, req.body, {gameId}))
  //   res.redirect(303, `/api/games/${result.nextQuery.params.gameId}/breaker`)
  // })
  //
  // router.post('/api/games/:gameId/guesses', (req, res) => {
  //   const {gameId} = req.params
  //   const result = controller.guess(Object.assign({}, req.body, {gameId}))
  //   if (result.data && result.data.errorMessage) {
  //     subscribe(result, req.headers['x-connection-id'])
  //     return res.status(400).json(result)
  //   }
  //   res.redirect(303, `/api/games/${result.nextQuery.params.gameId}/breaker`)
  // })
  //
  // router.post('/api/games/:gameId/scores', (req, res) => {
  //   const {gameId} = req.params
  //   const result = controller.score(Object.assign({}, req.body, {gameId}))
  //   res.redirect(303, `/api/games/${result.nextQuery.params.gameId}/maker`)
  // })
  //
  // router.post('/api/games/:gameId/end', (req, res) => {
  //   const {gameId} = req.params
  //   const result = controller.scoreCorrect(
  //     Object.assign({}, req.body, {gameId})
  //   )
  //   res.redirect(303, `/api/games/${result.nextQuery.params.gameId}/maker`)
  // })

  return router

  // function subscribe(result, connectionId) {
  //   result.subscribe(result => {
  //     const sse = sseConnections.get(connectionId)
  //     sse.write({
  //       data: result,
  //       event: 'gameChanged',
  //     })
  //   })
  //   result.subscribe = true
  //   return result
  // }
}
