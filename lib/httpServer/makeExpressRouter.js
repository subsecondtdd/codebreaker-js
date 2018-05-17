const {Router} = require('express')
module.exports = () => {
  const router = new Router()
  router.post('/api/games', (req, res) => {
    res.redirect(303, '/api/games/1234')
  })
  return router
}