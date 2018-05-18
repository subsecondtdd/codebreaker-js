const {Router} = require('express')
const browserify = require('browserify-middleware')
const SseStream = require('ssestream')
const nanoid = require('nanoid')

module.exports = ({controller}) => {
  const router = new Router()
  const sseConnections = new Map()

  router.get('/js/app.js', browserify(__dirname + '/app.js'))

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
    controller.startGame(req.body)
    res.redirect(303, '/api/games/1234')
  })

  router.get('/api/games/:gameId', (req, res) => {
    const result = controller.showGame({})
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
    controller.joinGame(req.body)
    res.redirect(303, '/api/games/1234')
  })

  router.post('/api/games/:gameId/guesses', (req, res) => {
    const result = controller.guess(req.body);
    if (result.data && result.data.errorMessage)
      return res.status(400).json(result)
    res.redirect(303, '/api/games/1234')
  })

  router.post('/api/games/:gameId/scores', (req, res) => {
    controller.score(req.body)
    res.redirect(303, '/api/games/1234')
  })

  router.post('/api/games/:gameId/end', (req, res) => {
    controller.scoreCorrect(req.body)
    res.redirect(303, '/api/games/1234')
  })

  return router
}