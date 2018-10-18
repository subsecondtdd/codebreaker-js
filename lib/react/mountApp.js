const React = require('react')
const ReactDOM = require('react-dom')
const App = require('./App')
// const ActiveState = require('./ActiveState')

module.exports = ($root, codebreaker, pubSub) => {
  // const activeState = new ActiveState(pubSub)
  const app = React.createElement(App, {codebreaker, pubSub})
  ReactDOM.render(app, $root)
}
