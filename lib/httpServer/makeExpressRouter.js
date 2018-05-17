const {Router} = require('express')
module.exports = ({controller}) => {
  const router = new Router()

  router.post('/api/games', (req, res) => {
    const result = controller.startGame(req.body)
    if (result.nextQuery && result.nextQuery.name === 'showGame') {
      res.redirect(303, '/api/games/1234')
    }
  })

  router.get('/api/games/:gameId', (req, res) => {
    const result = controller.showGame({})
    res.json(result.data)
  })

  return router
}