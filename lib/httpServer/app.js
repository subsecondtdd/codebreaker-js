const HttpCodebreaker = require('../domain/HttpCodebreaker')
const mountApp = require('../react/mountApp')
const EventSourcePubSub = require('pubsub-multi/src/EventSourcePubSub')
const eventSourceUrl = '/api/pubsub'

const fetch = window.fetch.bind(window)

mountApp(
  document.querySelector('#app'),
  new HttpCodebreaker(window.location.origin, fetch),
  new EventSourcePubSub(
    fetch,
    EventSource,
    eventSourceUrl
  )
)
