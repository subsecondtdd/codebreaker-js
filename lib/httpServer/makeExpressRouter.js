const {Router} = require('express')
const browserify = require('browserify-middleware')
const SseStream = require('ssestream')
const nanoid = require('nanoid')

module.exports = ({controller, serveClientApp}) => {
  const router = new Router()
  const sseConnections = new Map()

  if (serveClientApp) {
    router.get('/js/app.js', browserify(__dirname + '/app.js'))
  }

  router.get('/api/sse', (req, res) => {
    const sse = new SseStream(req)
    sse.pipe(res)

    const id = nanoid()
    sseConnections.set(id, sse)

    sse.write({
      data: id,
      event: 'connectionId'
    })
  })

  router.post('/api/games', (req, res) => {
    const result = controller.startGame(req.body)
    res.redirect(303, `/api/games/${result.nextQuery.params.gameId}`)
  })

  router.get('/api/games/:gameId', (req, res) => {
    const {gameId} = req.params
    const result = controller.showGame({gameId})
    result.subscribe(result => {
      const sse = sseConnections.get(req.headers['x-connection-id'])
      sse.write({
        data: result,
        event: 'gameChanged',
      })

    })
    result.subscribe = true
    res.json(result)
  })

  router.post('/api/games/:gameId/breaker', (req, res) => {
    const {gameId} = req.params
    const result = controller.joinGame(Object.assign({}, req.body, {gameId}))
    res.redirect(303, `/api/games/${result.nextQuery.params.gameId}`)
  })

  router.post('/api/games/:gameId/guesses', (req, res) => {
    const {gameId} = req.params
    const result = controller.guess(Object.assign({}, req.body, {gameId}));
    if (result.data && result.data.errorMessage)
      return res.status(400).json(result)
    res.redirect(303, `/api/games/${result.nextQuery.params.gameId}`)
  })

  router.post('/api/games/:gameId/scores', (req, res) => {
    const {gameId} = req.params
    const result = controller.score(Object.assign({}, req.body, {gameId}))
    res.redirect(303, `/api/games/${result.nextQuery.params.gameId}`)
  })

  router.post('/api/games/:gameId/end', (req, res) => {
    const {gameId} = req.params
    const result = controller.scoreCorrect(Object.assign({}, req.body, {gameId}))
    res.redirect(303, `/api/games/${result.nextQuery.params.gameId}`)
  })

  return router
}