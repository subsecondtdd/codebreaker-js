const React = require('react')
const ReactDOM = require('react-dom')
const App = require('./App')

module.exports = ($root, codebreaker, pubSub) => {
  const app = React.createElement(App, {codebreaker, pubSub})
  ReactDOM.render(app, $root)
}
