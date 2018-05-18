const {WebServer} = require('express-extensions')
const express = require('express')
const makeExpressRouter = require("./makeExpressRouter");

module.exports = ({controller}) => {
  const app = express()
  app.use(express.static('public'))
  app.use(express.json())
  app.use(makeExpressRouter({controller}))
  return new WebServer(app)
}
