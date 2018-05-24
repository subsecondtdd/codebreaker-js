const express = require('express')
const makeExpressRouter = require("./makeExpressRouter");

// Assembles the web app
module.exports = ({controller, serveClientApp}) => {
  const app = express()
  app.use(express.static('public'))
  app.use(express.static('node_modules/milligram/dist'))
  app.use(express.json())
  app.use(makeExpressRouter({controller, serveClientApp}))
  return app
}
