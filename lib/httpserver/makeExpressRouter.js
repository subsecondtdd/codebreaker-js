const { asyncRouter, respond } = require('express-extensions')

module.exports = ({controller}) => {

  const router = asyncRouter()

  router.$post('/games', async (req, res) => {
    const { secret } = req.body
    const result = controller.startGame({secret})
    respond("Xxxxxxx", res)
  })

  return router
}