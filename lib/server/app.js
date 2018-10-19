const HttpCodebreaker = require('../codebreaker/HttpCodebreaker')
const mountApp = require('../react/mountApp')
const EventSourcePubSub = require('pubsub-multi/src/EventSourcePubSub')
const eventSourceUrl = '/api/pubsub'
const fetch = window.fetch.bind(window)

const pubSub = new EventSourcePubSub(
  fetch,
  EventSource,
  eventSourceUrl
)

pubSub.makeSubscriber()
  .then(sub => mountApp(
    document.querySelector('#app'),
    new HttpCodebreaker(window.location.origin, fetch),
    sub
  ))
  .catch(err => console.error(err))
