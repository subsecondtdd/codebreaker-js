const React = require('react')
const ReactDOM = require('react-dom')
const App = require('./App')

module.exports = ($root, codebreaker, sub) => {
  const app = React.createElement(App, {codebreaker, sub})
  ReactDOM.render(app, $root)
}
