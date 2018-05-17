const {Router} = require('express')
module.exports = ({controller}) => {
  const router = new Router()

  router.post('/api/games', (req, res) => {
    controller.startGame(req.body)
    res.redirect(303, '/api/games/1234')
  })

  router.get('/api/games/:gameId', (req, res) => {
    const result = controller.showGame({})
    res.json(result.data)
  })

  router.post('/api/games/:gameId/breaker', (req, res) => {
    controller.joinGame(req.body)
    res.redirect(303, '/api/games/1234')
  })

  return router
}